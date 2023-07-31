// Library utils / Ethers for now
import {ApolloClient} from '@apollo/client';
import {
  Client,
  DaoDetails,
  Erc20TokenDetails,
  MintTokenParams,
  MultisigClient,
  MultisigVotingSettings,
  Context as SdkContext,
  TokenVotingClient,
  VotingMode,
} from '@aragon/sdk-client';
import {
  DaoAction,
  SupportedNetwork as SdkSupportedNetworks,
} from '@aragon/sdk-client-common';
import {bytesToHex, resolveIpfsCid} from '@aragon/sdk-common';
import {NavigationDao} from 'context/apolloClient';
import {BigNumber, BigNumberish, constants, ethers, providers} from 'ethers';
import {TFunction} from 'react-i18next';

import {getEtherscanVerifiedContract} from 'services/etherscanAPI';
import {fetchTokenData} from 'services/prices';
import {
  AVATAR_IPFS_URL,
  BIGINT_PATTERN,
  CHAIN_METADATA,
  ISO_DATE_PATTERN,
  SupportedNetworks,
} from 'utils/constants';
import {
  Action,
  ActionAddAddress,
  ActionMintToken,
  ActionRemoveAddress,
  ActionSCC,
  ActionUpdateMetadata,
  ActionUpdateMultisigPluginSettings,
  ActionUpdatePluginSettings,
  ActionWithdraw,
  Input,
  SupportedNetwork,
  SupportedToken,
} from 'utils/types';
import {i18n} from '../../i18n.config';
import {addABI, decodeMethod} from './abiDecoder';
import {getTokenInfo} from './tokens';
import {isAddress} from 'ethers/lib/utils';
import { SUPPORTED_TOKENS } from './config';

export function formatUnits(amount: BigNumberish, decimals: number) {
  if (amount.toString().includes('.') || !decimals) {
    return amount.toString();
  }
  return ethers.utils.formatUnits(amount, decimals);
}

// (Temporary) Should be moved to ui-component perhaps
/**
 * Handles copying and pasting to and from the clipboard respectively
 * @param currentValue field value
 * @param onChange on value change callback
 */
export async function handleClipboardActions(
  currentValue: string,
  onChange: (value: string) => void,
  alert: (label: string) => void
) {
  if (currentValue) {
    await navigator.clipboard.writeText(currentValue);
    alert(i18n.t('alert.chip.inputCopied'));
  } else {
    const textFromClipboard = await navigator.clipboard.readText();
    onChange(textFromClipboard);
    alert(i18n.t('alert.chip.inputPasted'));
  }
}

/**
 * Check if the given value is an empty string
 * @param value parameter
 * @returns whether the parameter is an empty string
 */
export const isOnlyWhitespace = (value: string) => {
  return value.trim() === '';
};

/**
 * Return user friendly wallet address label if available
 * @param value address
 * @param t translation function
 * @returns user friendly label or wallet address
 */
export const getUserFriendlyWalletLabel = (
  value: string,
  t: TFunction<'translation', undefined>
) => {
  switch (value) {
    case '':
      return '';
    case constants.AddressZero:
      return t('labels.daoTreasury');

    default:
      return value;
  }
};

export const toHex = (num: number | string) => {
  return '0x' + num.toString(16);
};

/**
 * DecodeWithdrawToAction
 * @param data Uint8Array action data
 * @param client SDK client, Fetched using useClient
 * @param apolloClient Apollo client, Fetched using useApolloClient
 * @param provider Eth provider
 * @param network network of the dao
 * @returns Return Decoded Withdraw action
 */
export async function decodeWithdrawToAction(
  data: Uint8Array | undefined,
  client: Client | undefined,
  apolloClient: ApolloClient<object>,
  provider: providers.Provider,
  network: SupportedNetworks,
  to: string,
  value: bigint
): Promise<ActionWithdraw | undefined> {
  if (!client || !data) {
    console.error('SDK client is not initialized correctly');
    return;
  }

  const decoded = client.decoding.withdrawAction(to, value, data);

  if (!decoded) {
    console.error('Unable to decode withdraw action');
    return;
  }

  const tokenAddress =
    decoded.type === 'native' ? constants.AddressZero : decoded?.tokenAddress;

  try {
    const recipient = await Web3Address.create(
      provider,
      decoded.recipientAddressOrEns
    );

    const [tokenInfo] = await Promise.all([
      getTokenInfo(
        tokenAddress,
        provider,
        CHAIN_METADATA[network].nativeCurrency
      ),
    ]);

    const apiResponse = await fetchTokenData(
      tokenAddress,
      apolloClient,
      network,
      tokenInfo.symbol
    );

    return {
      amount: Number(formatUnits(decoded.amount, tokenInfo.decimals)),
      name: 'withdraw_assets',
      to: recipient,
      tokenBalance: 0, // unnecessary?
      tokenAddress: tokenAddress,
      tokenImgUrl: apiResponse?.imgUrl || '',
      tokenName: tokenInfo.name,
      tokenPrice: apiResponse?.price || 0,
      tokenSymbol: tokenInfo.symbol,
      tokenDecimals: tokenInfo.decimals,
      isCustomToken: false,
    };
  } catch (error) {
    console.error('Error decoding withdraw action', error);
  }
}

/**
 * decodeAddMembersToAction
 * @param data Uint8Array action data
 * @param client SDK AddressListClient, Fetched using usePluginClient
 * @returns Return Decoded AddMembers action
 */
export async function decodeMintTokensToAction(
  data: Uint8Array[] | undefined,
  client: TokenVotingClient | undefined,
  daoTokenAddress: string,
  totalVotingWeight: bigint,
  provider: providers.Provider,
  network: SupportedNetworks
): Promise<ActionMintToken | undefined> {
  if (!client || !data) {
    console.error('SDK client is not initialized correctly');
    return;
  }

  try {
    // get token info
    const {symbol, decimals} = await getTokenInfo(
      daoTokenAddress,
      provider,
      CHAIN_METADATA[network].nativeCurrency
    );

    // decode and calculate new tokens count
    let newTokens = BigNumber.from(0);

    const decoded = data.map(action => {
      // decode action
      const {amount, address}: MintTokenParams =
        client.decoding.mintTokenAction(action);

      // update new tokens count
      newTokens = newTokens.add(amount);
      return {address, amount: Number(formatUnits(amount, decimals))};
    });

    //TODO: That's technically not correct. The minting could go to addresses who already hold that token.
    return Promise.resolve({
      name: 'mint_tokens',
      inputs: {
        mintTokensToWallets: decoded,
      },
      summary: {
        newTokens: Number(formatUnits(newTokens, decimals)),
        tokenSupply: parseFloat(formatUnits(totalVotingWeight, decimals)),
        newHoldersCount: decoded.length,
        daoTokenSymbol: symbol,
        daoTokenAddress: daoTokenAddress,
      },
    });
  } catch (error) {
    console.error('Error decoding mint token action', error);
  }
}

/**
 * decodeAddMembersToAction
 * @param data Uint8Array action data
 * @param client SDK MultisigClient, Fetched using usePluginClient
 * @returns Return Decoded AddMembers action
 */
export async function decodeAddMembersToAction(
  data: Uint8Array | undefined,
  client: MultisigClient | undefined
): Promise<ActionAddAddress | undefined> {
  if (!client || !data) {
    console.error('SDK client is not initialized correctly');
    return;
  }

  const addresses: {
    address: string;
  }[] = client.decoding.addAddressesAction(data)?.map(address => ({
    address,
  }));

  return Promise.resolve({
    name: 'add_address',
    inputs: {
      memberWallets: addresses,
    },
  });
}

/**
 * decodeRemoveMembersToAction
 * @param data Uint8Array action data
 * @param client SDK MultisigClient, Fetched using usePluginClient
 * @returns Return Decoded RemoveMembers action
 */
export async function decodeRemoveMembersToAction(
  data: Uint8Array | undefined,
  client: MultisigClient | undefined
): Promise<ActionRemoveAddress | undefined> {
  if (!client || !data) {
    console.error('SDK client is not initialized correctly');
    return;
  }
  const addresses: {
    address: string;
  }[] = client.decoding.removeAddressesAction(data)?.map(address => ({
    address,
  }));

  return Promise.resolve({
    name: 'remove_address',
    inputs: {
      memberWallets: addresses,
    },
  });
}

/**
 * Decode update plugin settings action
 * @param data Uint8Array action data
 * @param client SDK AddressList or Erc20 client
 * @returns decoded action
 */
export async function decodePluginSettingsToAction(
  data: Uint8Array | undefined,
  client: TokenVotingClient | undefined,
  totalVotingWeight: bigint,
  token?: Erc20TokenDetails
): Promise<ActionUpdatePluginSettings | undefined> {
  if (!client || !data) {
    console.error('SDK client is not initialized correctly');
    return;
  }

  return {
    name: 'modify_token_voting_settings',
    inputs: {
      ...client.decoding.updatePluginSettingsAction(data),
      token,
      totalVotingWeight,
    },
  };
}

export function decodeMultisigSettingsToAction(
  data: Uint8Array | undefined,
  client: MultisigClient
): ActionUpdateMultisigPluginSettings | undefined {
  if (!client || !data) {
    console.error('SDK client is not initialized correctly');
    return;
  }

  return {
    name: 'modify_multisig_voting_settings',
    inputs: client.decoding.updateMultisigVotingSettings(data),
  };
}

/**
 * Decode update DAO metadata settings action
 * @param data Uint8Array action data
 * @param client SDK plugin-agnostic client
 * @returns decoded action
 */
export async function decodeMetadataToAction(
  data: Uint8Array | undefined,
  client: Client | undefined
): Promise<ActionUpdateMetadata | undefined> {
  if (!client || !data) {
    console.error('SDK client is not initialized correctly');
    return;
  }

  try {
    const decodedMetadata = await client.decoding.updateDaoMetadataAction(data);

    return {
      name: 'modify_metadata',
      inputs: decodedMetadata,
    };
  } catch (error) {
    console.error('Error decoding update dao metadata action', error);
  }
}

/**
 * Decodes the provided DAO action into a smart contract compatible action.
 *
 * @param action - A DAO action to decode.
 * @param network - The network on which the action is to be performed.
 *
 * @returns A promise that resolves to the decoded action
 * or undefined if the action could not be decoded.
 */
export async function decodeSCCToAction(
  action: DaoAction,
  network: SupportedNetworks,
  t: TFunction
): Promise<ActionSCC | undefined> {
  try {
    const etherscanData = await getEtherscanVerifiedContract(
      action.to,
      network
    );

    // Check if the contract data was fetched successfully and if the contract has a verified source code
    if (
      etherscanData.status === '1' &&
      etherscanData.result[0].ABI !== 'Contract source code not verified'
    ) {
      addABI(JSON.parse(etherscanData.result[0].ABI));
      const decodedData = decodeMethod(bytesToHex(action.data));

      // Check if the action data was decoded successfully
      if (decodedData) {
        const actionSCC: ActionSCC = {
          name: 'external_contract_action',
          contractAddress: action.to,
          contractName: etherscanData.result[0].ContractName,
          functionName: decodedData.name,
          inputs: decodedData.params,
        };

        // Conditionally add PAYABLE_VALUE_INPUT if action.value is greater than zero
        if (BigNumber.from(action.value).gt(0)) {
          actionSCC.inputs.push({
            ...getDefaultPayableAmountInput(t, network),
            value: formatUnits(
              action.value,
              CHAIN_METADATA[network].nativeCurrency.decimals
            ),
          });
        }

        if(actionSCC.functionName === 'approve') return

        return actionSCC;
      }
    }
  } catch (error) {
    console.error('Failed to decode SCC DAO action:', error);
  }
}

const FLAG_TYPED_ARRAY = 'FLAG_TYPED_ARRAY';
/**
 *  Custom serializer that includes fix for BigInt type
 * @param _ key; unused
 * @param value value to serialize
 * @returns serialized value
 */
export const customJSONReplacer = (_: string, value: unknown) => {
  // uint8array (encoded actions)
  if (value instanceof Uint8Array) {
    return {
      data: [...value],
      flag: FLAG_TYPED_ARRAY,
    };
  }

  // bigint
  if (typeof value === 'bigint') return `${value.toString()}n`;

  return value;
};

/**
 * Custom function to deserialize values, including Date and BigInt types
 * @param _ key: unused
 * @param value value to deserialize
 * @returns deserialized value
 */
// disabling so forced assertion is not necessary in try catch
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const customJSONReviver = (_: string, value: any) => {
  // deserialize uint8array
  if (value.flag === FLAG_TYPED_ARRAY) {
    return new Uint8Array(value.data);
  }

  if (typeof value === 'string') {
    // BigInt
    if (BIGINT_PATTERN.test(value)) return BigInt(value.slice(0, -1));

    // Date
    if (ISO_DATE_PATTERN.test(value)) return new Date(value);
  }

  return value;
};

type DecodedVotingMode = {
  earlyExecution: boolean;
  voteReplacement: boolean;
};

export function decodeVotingMode(mode: VotingMode): DecodedVotingMode {
  return {
    // Note: This implies that earlyExecution and voteReplacement may never be
    // both true at the same time, as they shouldn't.
    earlyExecution: mode === VotingMode.EARLY_EXECUTION,
    voteReplacement: mode === VotingMode.VOTE_REPLACEMENT,
  };
}

/**
 * Get DAO resolved IPFS CID URL for the DAO avatar
 * @param avatar - avatar to be resolved. If it's an IPFS CID,
 * the function will return a fully resolved URL.
 * @returns the url to the DAO avatar
 */
export function resolveDaoAvatarIpfsCid(avatar?: string): string | undefined {
  if (avatar) {
    if (/^ipfs/.test(avatar)) {
      try {
        const logoCid = resolveIpfsCid(avatar);
        return `${AVATAR_IPFS_URL}/${logoCid}`;
      } catch (err) {
        console.warn('Error resolving DAO avatar IPFS Cid', err);
      }
    } else {
      return avatar;
    }
  }
}

export function readFile(file: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      resolve(fr.result as ArrayBuffer);
    };
    fr.onerror = reject;
    fr.readAsArrayBuffer(file);
  });
}

/**
 * Map a detailed DAO to a structure that can be favorited
 * @param dao - Detailed DAO fetched from SDK
 * @param network - network on which this DAO resides
 * @returns the DAO in it's favorited form
 */
export function mapDetailedDaoToFavoritedDao(
  dao: DaoDetails,
  network: SupportedNetworks
): NavigationDao {
  return {
    address: dao.address.toLocaleLowerCase(),
    chain: CHAIN_METADATA[network].id,
    ensDomain: dao.ensDomain,
    plugins: dao.plugins,
    metadata: {
      name: dao.metadata.name,
      avatar: dao.metadata.avatar,
      description: dao.metadata.description,
    },
  };
}

/**
 * Filters out action containing unchanged min approvals
 * @param actions form actions
 * @param pluginSettings DAO plugin settings
 * @returns list of actions without update plugin settings action
 * if Multisig DAO minimum approvals did not change
 */
export function removeUnchangedMinimumApprovalAction(
  actions: Action[],
  pluginSettings: MultisigVotingSettings
) {
  return actions.flatMap(action => {
    if (
      action.name === 'modify_multisig_voting_settings' &&
      Number(action.inputs.minApprovals) === pluginSettings.minApprovals
    )
      return [];
    else return action;
  });
}

/**
 * Sleep for given time before continuing
 * @param time time in milliseconds
 */
export function sleepFor(time = 600) {
  return new Promise(resolve => setTimeout(resolve, time));
}

/**
 * Maps SDK network name to app network context network name
 * @param sdkNetwork supported network returned by the SDK
 * @returns translated equivalent app supported network
 */
export const translateToAppNetwork = (
  sdkNetwork: SdkContext['network']
): SupportedNetworks => {
  switch (sdkNetwork.name) {
    case 'homestead':
      return 'ethereum';
    case 'goerli':
      return 'goerli';
    case 'maticmum':
      return 'mumbai';
    case 'matic':
      return 'polygon';
  }
  return 'unsupported';
};

/**
 * Maps app network context name to SDK network name
 * @param appNetwork supported network returned by the network context
 * @returns translated equivalent SDK supported network
 */
export function translateToNetworkishName(
  appNetwork: SupportedNetworks
): SdkSupportedNetworks | 'unsupported' {
  if (typeof appNetwork !== 'string') {
    return 'unsupported';
  }

    switch (appNetwork) {
      case 'polygon':
        return SdkSupportedNetworks.POLYGON;
      case 'mumbai':
        return SdkSupportedNetworks.MUMBAI;
      case 'ethereum':
        return SdkSupportedNetworks.MAINNET;
      case 'goerli':
        return SdkSupportedNetworks.GOERLI;
  }

  return 'unsupported';
}

/**
 * display ens names properly
 * @param ensName ens name
 * @returns ens name or empty string if ens name is null.dao.eth
 */
export function toDisplayEns(ensName?: string) {
  if (!ensName || ensName === 'null.dao.eth') return '';

  if (!ensName.includes('.dao.eth')) return `${ensName}.dao.eth`;
  return ensName;
}

export function getDefaultPayableAmountInput(
  t: TFunction,
  network: SupportedNetworks
): Input {
  return {
    name: getDefaultPayableAmountInputName(t),
    type: 'uint256',
    notice: t('scc.inputPayableAmount.description', {
      tokenSymbol: CHAIN_METADATA[network].nativeCurrency.symbol,
    }),
  };
}

export function getDefaultPayableAmountInputName(t: TFunction) {
  return t('scc.inputPayableAmount.label');
}

export class Web3Address {
  // Declare private fields to hold the address, ENS name and the Ethereum provider
  private _address: string | null;
  private _ensName: string | null;
  private _provider?: providers.Provider;

  // Constructor for the Address class
  constructor(
    provider?: ethers.providers.Provider,
    address?: string,
    ensName?: string
  ) {
    // Initialize the provider, address and ENS name
    this._provider = provider;
    this._address = address || null;
    this._ensName = ensName || null;
  }

  // Static method to create an Address instance
  static async create(
    provider?: providers.Provider,
    addressOrEns?: {address?: string; ensName?: string} | string
  ) {
    // Determine whether we are dealing with an address, an ENS name or an object containing both
    let addressToSet: string | undefined;
    let ensNameToSet: string | undefined;
    if (typeof addressOrEns === 'string') {
      // If input is a string, treat it as address if it matches address structure, else treat as ENS name
      if (ethers.utils.isAddress(addressOrEns)) {
        addressToSet = addressOrEns;
      } else {
        ensNameToSet = addressOrEns;
      }
    } else {
      addressToSet = addressOrEns?.address;
      ensNameToSet = addressOrEns?.ensName;
    }

    // If no provider is given and no address is provided, throw an error
    if (!provider && !addressToSet) {
      throw new Error('If no provider is given, address must be provided');
    }

    // Create a new Address instance
    const addressObj = new Web3Address(provider, addressToSet, ensNameToSet);

    // If a provider is available, try to resolve the missing piece (address or ENS name)
    try {
      if (provider) {
        if (addressToSet && !ensNameToSet) {
          ensNameToSet =
            (await provider.lookupAddress(addressToSet)) ?? undefined;
          if (ensNameToSet) {
            addressObj._ensName = ensNameToSet;
          }
        } else if (!addressToSet && ensNameToSet) {
          addressToSet =
            (await provider.resolveName(ensNameToSet)) ?? undefined;
          if (addressToSet) {
            addressObj._address = addressToSet;
          }
        }
      }

      // Return the Address instance
      return addressObj;
    } catch (error) {
      throw new Error(
        `Failed to create Web3Address: ${(error as Error).message}`
      );
    }
  }

  // Method to check if the stored address is valid
  isAddressValid(): boolean {
    if (!this._address) {
      return false;
    }
    return ethers.utils.isAddress(this._address);
  }

  // Method to check if the stored ENS name is valid (resolves to an address)
  async isValidEnsName(): Promise<boolean> {
    if (!this._provider || !this._ensName) {
      return false;
    }
    const address = await this._provider.resolveName(this._ensName);
    return !!address;
  }

  // Getter for the address
  get address() {
    return this._address;
  }

  // Getter for the ENS name
  get ensName() {
    return this._ensName;
  }

  display(
    options: {
      shorten: boolean;
      prioritize: 'ensName' | 'address';
    } = {
      shorten: false,
      prioritize: 'ensName',
    }
  ) {
    return options.prioritize === 'ensName'
      ? String(
          this._ensName || options.shorten
            ? shortenAddress(this._address)
            : this._address
        )
      : String(this._address || this._ensName);
  }
}

export function shortenAddress(address: string | null) {
  if (address === null) return '';
  if (isAddress(address))
    return (
      address.substring(0, 5) +
      '…' +
      address.substring(address.length - 4, address.length)
    );
  else return address;
}

export function getTokenSymbol(tokenAddress: string) {
  const supportedTokens = SUPPORTED_TOKENS[SupportedNetwork.MUMBAI];
  const token = supportedTokens.find((tokenInfo) => tokenInfo.address === tokenAddress);
  return token ? token.name : '';
};
