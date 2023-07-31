import { useReactiveVar } from '@apollo/client';
import {
  CreateMajorityVotingProposalParams,
  InstalledPluginListItem,
  MultisigClient,
  MultisigVotingSettings,
  ProposalCreationSteps,
  TokenVotingClient,
  VotingSettings,
  WithdrawParams,
} from '@aragon/sdk-client';

import {
  DaoAction,
  ProposalMetadata,
  TokenType
} from '@aragon/sdk-client-common';
import { hexToBytes } from '@aragon/sdk-common';
import { ethers } from 'ethers';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate } from 'react-router-dom';

import { Loading } from 'components/temporary';
import PublishModal from 'containers/transactionModals/publishModal';
import { useClient } from 'hooks/useClient';
import { useDaoDetailsQuery } from 'hooks/useDaoDetails';
import { useDaoToken } from 'hooks/useDaoToken';
import { PluginTypes, usePluginClient } from 'hooks/usePluginClient';
import {
  isMultisigVotingSettings,
  isTokenVotingSettings,
  usePluginSettings,
} from 'hooks/usePluginSettings';
import { usePollGasFee } from 'hooks/usePollGasfee';
import { useTokenSupply } from 'hooks/useTokenSupply';
import { useWallet } from 'hooks/useWallet';
import { trackEvent } from 'services/analytics';
import { getEtherscanVerifiedContract } from 'services/etherscanAPI';
import {
  PENDING_MULTISIG_PROPOSALS_KEY,
  PENDING_PROPOSALS_KEY,
  TransactionState,
} from 'utils/constants';
import {
  daysToMills,
  getCanonicalDate,
  getCanonicalTime,
  getCanonicalUtcOffset,
  getDHMFromSeconds,
  hoursToMills,
  minutesToMills,
  offsetToMills,
} from 'utils/date';
import {
  customJSONReplacer,
  getDefaultPayableAmountInputName,
  toDisplayEns,
} from 'utils/library';
import { Proposal } from 'utils/paths';
import {
  CacheProposalParams,
  getNonEmptyActions,
  mapToCacheProposal,
} from 'utils/proposals';
import { isNativeToken } from 'utils/tokens';
import { ProposalId, ProposalResource } from 'utils/types';
import {
  pendingMultisigProposalsVar,
  pendingTokenBasedProposalsVar,
} from './apolloClient';
import { useGlobalModalContext } from './globalModals';
import { useNetwork } from './network';
import { usePrivacyContext } from './privacyContext';
import { encodeActionsGroup, encodeCreateGroupAction, encodeCreditDelegationAction, encodeSwapAction } from 'utils/encoding';
import { useInstalledPlugins } from 'hooks/useInstalledPlugins';

type Props = {
  showTxModal: boolean;
  setShowTxModal: (value: boolean) => void;
};

const CreateProposalProvider: React.FC<Props> = ({
  showTxModal,
  setShowTxModal,
  children,
}) => {
  const { t } = useTranslation();
  const { open } = useGlobalModalContext();
  const { preferences } = usePrivacyContext();

  const navigate = useNavigate();
  const { getValues } = useFormContext();

  const { network } = useNetwork();
  const { isOnWrongNetwork, provider, address } = useWallet();

  const { data: daoDetails, isLoading: daoDetailsLoading } = useDaoDetailsQuery();
  const { id: pluginType, instanceAddress: pluginAddress } =
    daoDetails?.plugins.find(
      (plugin: any) => plugin.id.includes("token-voting") || plugin.id.includes("multisig.plugin"))
    || ({} as InstalledPluginListItem);


  const { data: daoToken } = useDaoToken(pluginAddress);
  const { data: tokenSupply } = useTokenSupply(daoToken?.address || '');
  const { data: pluginSettings } = usePluginSettings(
    pluginAddress,
    pluginType as PluginTypes
  );

  const { client } = useClient();
  const pluginClient = usePluginClient(pluginType as PluginTypes);
  const {
    days: minDays,
    hours: minHours,
    minutes: minMinutes,
  } = getDHMFromSeconds((pluginSettings as VotingSettings).minDuration);

  const [proposalId, setProposalId] = useState<string>();
  const [proposalCreationData, setProposalCreationData] =
    useState<CreateMajorityVotingProposalParams>();
  const [creationProcessState, setCreationProcessState] =
    useState<TransactionState>(TransactionState.WAITING);

  const cachedMultisigProposals = useReactiveVar(pendingMultisigProposalsVar);
  const cachedTokenBasedProposals = useReactiveVar(
    pendingTokenBasedProposalsVar
  );

  const {
    creditDelegation: creditDelegationAddress,
    subgovernance: subgovernancePlugin,
    uniswapV3: uniswapV3Plugin
  } = useInstalledPlugins(daoDetails?.address)

  const shouldPoll = useMemo(
    () =>
      creationProcessState === TransactionState.WAITING &&
      proposalCreationData !== undefined,
    [creationProcessState, proposalCreationData]
  );

  const disableActionButton =
    !proposalCreationData && creationProcessState !== TransactionState.SUCCESS;

  /*************************************************
   *             Callbacks and Handlers            *
   *************************************************/
  const encodeActions = useCallback(async () => {
    const actionsFromForm = getValues('actions');
    const actions: Array<Promise<DaoAction> | Promise<DaoAction[]>> = [];

    let propagateActions: boolean = false;

    // return an empty array for undefined clients
    if (!pluginClient || !client) return Promise.resolve([] as DaoAction[]);

    for await (const action of getNonEmptyActions(actionsFromForm)) {
      switch (action.name) {
        case 'withdraw_assets': {
          actions.push(
            client.encoding.withdrawAction({
              amount: BigInt(
                Number(action.amount) * Math.pow(10, action.tokenDecimals)
              ),

              /* TODO: SDK doesn't accept ens names, this should be removed once they
                 fixed the issue */
              recipientAddressOrEns: action.to.address,
              ...(isNativeToken(action.tokenAddress)
                ? { type: TokenType.NATIVE }
                : { type: TokenType.ERC20, tokenAddress: action.tokenAddress }),
            } as WithdrawParams)
          );
          break;
        }
        case 'mint_tokens': {
          action.inputs.mintTokensToWallets.forEach(mint => {
            actions.push(
              Promise.resolve(
                (pluginClient as TokenVotingClient).encoding.mintTokenAction(
                  action.summary.daoTokenAddress as string,
                  {
                    address: mint.address,
                    amount: BigInt(Number(mint.amount) * Math.pow(10, 18)),
                  }
                )
              )
            );
          });
          break;
        }
        case 'add_address': {
          const wallets = action.inputs.memberWallets.map(
            wallet => wallet.address
          );
          actions.push(
            Promise.resolve(
              (pluginClient as MultisigClient).encoding.addAddressesAction({
                pluginAddress: pluginAddress,
                members: wallets,
              })
            )
          );
          break;
        }
        case 'remove_address': {
          const wallets = action.inputs.memberWallets.map(
            wallet => wallet.address
          );
          if (wallets.length > 0)
            actions.push(
              Promise.resolve(
                (pluginClient as MultisigClient).encoding.removeAddressesAction(
                  {
                    pluginAddress: pluginAddress,
                    members: wallets,
                  }
                )
              )
            );
          break;
        }
        case 'modify_multisig_voting_settings': {
          actions.push(
            Promise.resolve(
              (
                pluginClient as MultisigClient
              ).encoding.updateMultisigVotingSettings({
                pluginAddress: pluginAddress,
                votingSettings: {
                  minApprovals: action.inputs.minApprovals,
                  onlyListed: (pluginSettings as MultisigVotingSettings)
                    .onlyListed,
                },
              })
            )
          );
          break;
        }
        case 'external_contract_action': {
          const etherscanData = await getEtherscanVerifiedContract(
            action.contractAddress,
            network
          );

          if (
            etherscanData.status === '1' &&
            etherscanData.result[0].ABI !== 'Contract source code not verified'
          ) {
            const functionParams = action.inputs
              .filter(
                // ignore payable value
                input => input.name !== getDefaultPayableAmountInputName(t)
              )
              .map(input => {
                const param = input.value;

                if (typeof param === 'string' && param.indexOf('[') === 0) {
                  return JSON.parse(param);
                }
                return param;
              });

            const iface = new ethers.utils.Interface(
              etherscanData.result[0].ABI
            );
            const hexData = iface.encodeFunctionData(
              action.functionName,
              functionParams
            );

            actions.push(
              Promise.resolve({
                to: action.contractAddress,
                value: ethers.utils.parseEther(action.value || '0').toBigInt(),
                data: hexToBytes(hexData),
              })
            );
          }
          break;
        }
        case 'credit_delegation': {
          actions.push(
            Promise.resolve(
              encodeCreditDelegationAction(
                action.inputs.token,
                action.inputs.amount,
                action.inputs.interestRateType,
                daoDetails?.address || "",
                action.inputs.user,
                creditDelegationAddress?.instanceAddress || "",
                provider,
                network
              ))
          );
          propagateActions = true
          break;
        }
        case 'create_group': {
          const groupName = getValues('groupName');
          const membersAddresses = getValues('addresses');
          actions.push(
            Promise.resolve(
              encodeCreateGroupAction(
                groupName,
                membersAddresses,
                subgovernancePlugin?.instanceAddress || ""
              )
            ));
          break;
        }
        case 'add_member': {
          const membersAddresses = getValues('addresses');
          break;
        }
        case 'swap_tokens': {
          //TODO - Remove hardcoded values
          actions.push(
            Promise.resolve(
              encodeSwapAction(
                action.inputs.tokenInput,
                action.inputs.tokenOutput,
                '3000',
                daoDetails?.address || '',
                action.inputs.amount.toString(),
                '0',
                '0',
                uniswapV3Plugin?.instanceAddress || '',
                provider,
                network
              )))
          break;
        }
      }
    }

    const actionsEncoded = (await Promise.all(actions)).flat();

    if (!propagateActions) return actionsEncoded

    const actionsGrouped = encodeActionsGroup(
      daoDetails?.address || "",
      actionsEncoded,
      creditDelegationAddress?.instanceAddress || ""
    )

    return actionsGrouped

  }, [
    getValues,
    pluginClient,
    client,
    pluginAddress,
    pluginSettings,
    network,
    t,
  ]);

  // Because getValues does NOT get updated on each render, leaving this as
  // a function to be called when data is needed instead of a memoized value
  const getProposalCreationParams =
    useCallback(async (): Promise<CreateMajorityVotingProposalParams> => {
      const [
        title,
        summary,
        description,
        resources,
        startDate,
        startTime,
        startUtc,
        endDate,
        endTime,
        endUtc,
        durationSwitch,
        startSwitch,
      ] = getValues([
        'proposalTitle',
        'proposalSummary',
        'proposal',
        'links',
        'startDate',
        'startTime',
        'startUtc',
        'endDate',
        'endTime',
        'endUtc',
        'durationSwitch',
        'startSwitch',
      ]);

      const actions = await encodeActions();

      const metadata: ProposalMetadata = {
        title,
        summary,
        description,
        resources: resources.filter((r: ProposalResource) => r.name && r.url),
      };

      const ipfsUri = await pluginClient?.methods.pinMetadata(metadata);

      // getting dates
      let startDateTime: Date;
      const startMinutesDelay = isMultisigVotingSettings(pluginSettings)
        ? 0
        : 10;

      if (startSwitch === 'now') {
        startDateTime = new Date(
          `${getCanonicalDate()}T${getCanonicalTime({
            minutes: startMinutesDelay,
          })}:00${getCanonicalUtcOffset()}`
        );
      } else {
        startDateTime = new Date(
          `${startDate}T${startTime}:00${getCanonicalUtcOffset(startUtc)}`
        );
      }

      // End date
      let endDateTime;
      if (durationSwitch === 'duration') {
        const [days, hours, minutes] = getValues([
          'durationDays',
          'durationHours',
          'durationMinutes',
        ]);

        // Calculate the end date using duration
        const endDateTimeMill =
          startDateTime.valueOf() + offsetToMills({ days, hours, minutes });

        endDateTime = new Date(endDateTimeMill);
      } else {
        endDateTime = new Date(
          `${endDate}T${endTime}:00${getCanonicalUtcOffset(endUtc)}`
        );
      }

      if (startSwitch === 'now') {
        endDateTime = new Date(
          endDateTime.getTime() + minutesToMills(startMinutesDelay)
        );
      } else {
        if (startDateTime.valueOf() < new Date().valueOf()) {
          startDateTime = new Date(
            `${getCanonicalDate()}T${getCanonicalTime({
              minutes: startMinutesDelay,
            })}:00${getCanonicalUtcOffset()}`
          );
        }

        const minEndDateTimeMills =
          startDateTime.valueOf() +
          daysToMills(minDays || 0) +
          hoursToMills(minHours || 0) +
          minutesToMills(minMinutes || 0);

        if (endDateTime.valueOf() < minEndDateTimeMills) {
          const legacyStartDate = new Date(
            `${startDate}T${startTime}:00${getCanonicalUtcOffset(startUtc)}`
          );
          const endMills =
            endDateTime.valueOf() +
            (startDateTime.valueOf() - legacyStartDate.valueOf());

          endDateTime = new Date(endMills);
        }
      }

      /**
       * For multisig proposals, in case "now" as start time is selected, we want
       * to keep startDate undefined, so it's automatically evaluated.
       * If we just provide "Date.now()", than after user still goes through the flow
       * it's going to be date from the past. And SC-call evaluation will fail.
       */
      const finalStartDate =
        startSwitch === 'now' && isMultisigVotingSettings(pluginSettings)
          ? undefined
          : startDateTime;

      // Ignore encoding if the proposal had no actions
      return {
        pluginAddress,
        metadataUri: ipfsUri || '',
        startDate: finalStartDate,
        endDate: endDateTime,
        actions,
      };
    }, [
      encodeActions,
      getValues,
      minDays,
      minHours,
      minMinutes,
      pluginAddress,
      pluginClient?.methods,
      pluginSettings,
    ]);

  const estimateCreationFees = useCallback(async () => {
    if (!pluginClient) {
      return Promise.reject(
        new Error('ERC20 SDK client is not initialized correctly')
      );
    }
    if (!proposalCreationData) return;

    return pluginClient?.estimation.createProposal(proposalCreationData);
  }, [pluginClient, proposalCreationData]);

  const {
    tokenPrice,
    maxFee,
    averageFee,
    stopPolling,
    error: gasEstimationError,
  } = usePollGasFee(estimateCreationFees, shouldPoll);

  const handleCloseModal = useCallback(() => {
    switch (creationProcessState) {
      case TransactionState.LOADING:
        break;
      case TransactionState.SUCCESS:
        navigate(
          generatePath(Proposal, {
            network,
            dao: toDisplayEns(daoDetails?.ensDomain) || daoDetails?.address,
            id: proposalId,
          })
        );
        break;
      default: {
        setCreationProcessState(TransactionState.WAITING);
        setShowTxModal(false);
        stopPolling();
      }
    }
  }, [
    creationProcessState,
    daoDetails?.address,
    daoDetails?.ensDomain,
    navigate,
    network,
    proposalId,
    setShowTxModal,
    stopPolling,
  ]);

  const handleCacheProposal = useCallback(
    (proposalGuid: string) => {
      if (!address || !daoDetails || !pluginSettings || !proposalCreationData)
        return;

      const [title, summary, description, resources] = getValues([
        'proposalTitle',
        'proposalSummary',
        'proposal',
        'links',
      ]);

      let cacheKey = '';
      let newCache;
      let proposalToCache;

      let proposalData: CacheProposalParams = {
        creatorAddress: address,
        daoAddress: daoDetails?.address,
        daoName: daoDetails?.metadata.name,
        proposalGuid,
        proposalParams: {
          ...proposalCreationData,
          startDate: proposalCreationData.startDate || new Date(), // important to fallback to avoid passing undefined
        },
        metadata: {
          title,
          summary,
          description,
          resources: resources.filter((r: ProposalResource) => r.name && r.url),
        },
      };

      if (isTokenVotingSettings(pluginSettings)) {
        proposalData = {
          ...proposalData,
          daoToken,
          pluginSettings,
          totalVotingWeight: tokenSupply?.raw,
        };

        cacheKey = PENDING_PROPOSALS_KEY;
        proposalToCache = mapToCacheProposal(proposalData);
        newCache = {
          ...cachedTokenBasedProposals,
          [daoDetails.address]: {
            ...cachedTokenBasedProposals[daoDetails.address],
            [proposalGuid]: { ...proposalToCache },
          },
        };
        pendingTokenBasedProposalsVar(newCache);
      } else if (isMultisigVotingSettings(pluginSettings)) {
        proposalData.minApprovals = pluginSettings.minApprovals;
        proposalData.onlyListed = pluginSettings.onlyListed;
        cacheKey = PENDING_MULTISIG_PROPOSALS_KEY;
        proposalToCache = mapToCacheProposal(proposalData);
        newCache = {
          ...cachedMultisigProposals,
          [daoDetails.address]: {
            ...cachedMultisigProposals[daoDetails.address],
            [proposalGuid]: { ...proposalToCache },
          },
        };
        pendingMultisigProposalsVar(newCache);
      }

      // persist new cache if functional cookies enabled
      if (preferences?.functional) {
        localStorage.setItem(
          cacheKey,
          JSON.stringify(newCache, customJSONReplacer)
        );
      }
    },
    [
      address,
      cachedMultisigProposals,
      cachedTokenBasedProposals,
      daoDetails,
      daoToken,
      getValues,
      pluginSettings,
      preferences?.functional,
      proposalCreationData,
      tokenSupply?.raw,
    ]
  );

  const handlePublishProposal = useCallback(async () => {
    if (!pluginClient) {
      return new Error('ERC20 SDK client is not initialized correctly');
    }

    // if no creation data is set, or transaction already running, do nothing.
    if (
      !proposalCreationData ||
      creationProcessState === TransactionState.LOADING
    ) {
      console.log('Transaction is running');
      return;
    }

    trackEvent('newProposal_createNowBtn_clicked', {
      dao_address: daoDetails?.address,
      estimated_gwei_fee: averageFee,
      total_usd_cost: averageFee ? tokenPrice * Number(averageFee) : 0,
    });

    const proposalIterator =
      pluginClient.methods.createProposal(proposalCreationData);

    if (creationProcessState === TransactionState.SUCCESS) {
      handleCloseModal();
      return;
    }

    if (isOnWrongNetwork) {
      open('network');
      handleCloseModal();
      return;
    }

    setCreationProcessState(TransactionState.LOADING);

    // NOTE: quite weird, I've had to wrap the entirety of the generator
    // in a try-catch because when the user rejects the transaction,
    // the try-catch block inside the for loop would not catch the error
    // FF - 11/21/2020
    try {
      for await (const step of proposalIterator) {
        switch (step.key) {
          case ProposalCreationSteps.CREATING:
            console.log(step.txHash);
            trackEvent('newProposal_transaction_signed', {
              dao_address: daoDetails?.address,
              network: network,
              wallet_provider: provider?.connection.url,
            });
            break;
          case ProposalCreationSteps.DONE: {
            //TODO: replace with step.proposal id when SDK returns proper format
            const prefixedId = new ProposalId(
              step.proposalId
            ).makeGloballyUnique(pluginAddress);

            setProposalId(prefixedId);
            setCreationProcessState(TransactionState.SUCCESS);
            trackEvent('newProposal_transaction_success', {
              dao_address: daoDetails?.address,
              network: network,
              wallet_provider: provider?.connection.url,
              proposalId: prefixedId,
            });

            // cache proposal
            handleCacheProposal(prefixedId);
            break;
          }
        }
      }
    } catch (error) {
      console.error(error);
      setCreationProcessState(TransactionState.ERROR);
      trackEvent('newProposal_transaction_failed', {
        dao_address: daoDetails?.address,
        network: network,
        wallet_provider: provider?.connection.url,
        error,
      });
    }
  }, [
    averageFee,
    creationProcessState,
    daoDetails?.address,
    handleCacheProposal,
    handleCloseModal,
    isOnWrongNetwork,
    network,
    open,
    pluginAddress,
    pluginClient,
    proposalCreationData,
    provider?.connection.url,
    tokenPrice,
  ]);

  /*************************************************
   *                     Effects                   *
   *************************************************/
  useEffect(() => {
    // set proposal creation data
    async function setProposalData() {
      if (showTxModal && creationProcessState === TransactionState.WAITING)
        setProposalCreationData(await getProposalCreationParams());
      else if (!showTxModal) setProposalCreationData(undefined);
    }

    setProposalData();
  }, [creationProcessState, getProposalCreationParams, showTxModal]);

  /*************************************************
   *                    Render                     *
   *************************************************/

  if (daoDetailsLoading) {
    return <Loading />;
  }

  return (
    <>
      {children}
      <PublishModal
        state={creationProcessState || TransactionState.WAITING}
        isOpen={showTxModal}
        onClose={handleCloseModal}
        callback={handlePublishProposal}
        closeOnDrag={creationProcessState !== TransactionState.LOADING}
        maxFee={maxFee}
        averageFee={averageFee}
        gasEstimationError={gasEstimationError}
        tokenPrice={tokenPrice}
        title={t('TransactionModal.createProposal')}
        buttonLabel={t('TransactionModal.createProposal')}
        buttonLabelSuccess={t('TransactionModal.goToProposal')}
        disabledCallback={disableActionButton}
      />
    </>
  );
};

export { CreateProposalProvider };
