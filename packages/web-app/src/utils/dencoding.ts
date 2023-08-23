//TODO: Move to our own sdk
import { bytesToHex, hexToBytes } from "@aragon/sdk-common";
import { CreditDelegator__factory } from "typechain-types/CreditDelegator__factory";
import { Subgovernance__factory } from "typechain-types/Subgovernance__factory";
import { Uniswapv3__factory } from "typechain-types/Uniswapv3__factory";
import { Action, ActionAddMember, ActionCreditDelegation, ActionLoanOffer, ActionSwapTokens, InterestRateType } from "./types"
import {
  getFunctionFragment
} from "@aragon/sdk-client-common";
import { AVAILABLE_FUNCTION_SIGNATURES, CHAIN_METADATA, SupportedNetworks } from "./constants";
import {
  DaoAction
} from '@aragon/sdk-client-common';
import { getTokenInfo } from "./tokens";
import { SUPPORTED_TOKENS } from "./config";
import { Pwn__factory } from "typechain-types/Pwn__factory";
import { ethers } from "ethers";

export const decodeCreditDelegationAction = async (
  data: Uint8Array,
  isGrouped: boolean,
  provider: any,
  network: SupportedNetworks
): Promise<ActionCreditDelegation | undefined> => {

  const iface = CreditDelegator__factory.createInterface()
  const hexBytes = bytesToHex(data)

  const expectedfunction = iface.getFunction("borrowAndTransfer");
  const result = iface.decodeFunctionData(
    expectedfunction,
    isGrouped ? data : hexBytes,
  );

  let tokenInfo;

  if (provider) {
    tokenInfo = await getTokenInfo(
      result[0],
      provider,
      CHAIN_METADATA[network].nativeCurrency
    )
  }

  return {
    name: "credit_delegation",
    inputs: {
      amount: Number(result[1]) / Math.pow(10, tokenInfo?.decimals || 18),
      interestRateType: Number([result[2]]) == 2 ? InterestRateType.VARIABLE : InterestRateType.STABLE,
      token: result[0],
      user: result[5]
    }
  }
}


export const decodeGroupedActions = (data: Uint8Array): DaoAction[] | undefined => {
  try {
    const iface = CreditDelegator__factory.createInterface()
    const hexBytes = bytesToHex(data)

    const expectedfunction = iface.getFunction("registerActions");
    const result = iface.decodeFunctionData(
      expectedfunction,
      hexBytes,
    );

    return result['_actions']

  } catch (error) {

  }
}

export const decodeSwapAction = async (
  data: Uint8Array,
): Promise<ActionSwapTokens | undefined> => {
  try {
    const iface = Uniswapv3__factory.createInterface()
    const hexBytes = bytesToHex(data)

    const expectedfunction = iface.getFunction("swap");
    const result = iface.decodeFunctionData(
      expectedfunction,
      hexBytes,
    );

    const tokenIn = result['tokenIn'].toString().toLowerCase()
    const tokenOut = result['tokenOut'].toString().toLowerCase()
    const tokenInput = SUPPORTED_TOKENS['maticmum'].find(token => token.address.toLowerCase() === tokenOut);
    const tokenOutput = SUPPORTED_TOKENS['maticmum'].find(token => token.address.toLowerCase() === tokenIn);

    return {
      name: "swap_tokens",
      inputs: {
        amount: Number(result['amountIn']) / Math.pow(10, tokenInput?.decimals || 18),
        tokenInput: tokenInput?.name || "",
        tokenOutput: tokenOutput?.name || ""
      }
    }

  } catch (error) {

  }
}


export const decodeMakeOfferAction = async (
  data: Uint8Array,
): Promise<ActionLoanOffer | undefined> => {
  try {
    const iface = Pwn__factory.createInterface()
    const hexBytes = bytesToHex(data)

    const expectedfunction = iface.getFunction("makeOffer");
    const result = iface.decodeFunctionData(
      expectedfunction,
      hexBytes,
    );

    const {offer} = result

    return {
      name: "loan_offer",
      inputs: {
        borrower: offer['borrower'],
        collateralAddress: offer['collateralAddress'],
        collateralAmount: Number(offer['collateralAmount']),
        collateralId: Number(offer['collateralId']),
        collateralType: offer['collateralCategory'],
        durationTime: Number(offer['duration']),
        expirationTime: Number(offer['expiration']),
        fundingSource: "DAO",
        isPersistent: "Yes",
        loanAmount: Number(offer['loanAmount']),
        loanYield: Number(offer['loanYield']),
        principalAsset: offer['loanAssetAddress'],
        interestRateType: InterestRateType.STABLE,
        pwnPluginAddress: "",
        nonce: ethers.utils.id(`nonce_${Number(offer['loanAmount'])}`)
      }
    }

  } catch (error) {

  }
}


export const decodeCreateGroupAction = async (data: Uint8Array): Promise<Action[] | undefined> => {
  const iface = Subgovernance__factory.createInterface()
  const hexBytes = bytesToHex(data)

  const expectedfunction = iface.getFunction("createGroup");
  const result = iface.decodeFunctionData(
    expectedfunction,
    hexBytes,
  );

  const groupName = result['_groupName']
  const members = result['_members']
  let memberActions: ActionAddMember[] = []

  for (let i = 0; i < members.length; i++) {
    memberActions.push(
      {
        name: "add_member",
        inputs: {
          address: members[i]
        }
      }
    )
  }

  return [{
    name: "create_group",
    inputs: {
      groupName
    }
  },
  ...memberActions
  ]
}

export const findInterfaceCustomPlugins = (data: Uint8Array, isGrouped: boolean = false) => {
  const decodeData = isGrouped ? hexToBytes(data.toString()) : data

  try {
    const func = getFunctionFragment(decodeData, AVAILABLE_FUNCTION_SIGNATURES);
    return {
      id: func.format("minimal"),
      functionName: func.name,
      hash: bytesToHex(data).substring(0, 10),
    };
  } catch {
    return null;
  }
}
