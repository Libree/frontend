import React from 'react';
import { useFormContext } from 'react-hook-form';

import { MultisigVotingSettings } from '@aragon/sdk-client';
import { TemporarySection } from 'components/temporary';
import TokenMenu from 'containers/tokenMenu';
import { useActionsContext } from 'context/actions';
import { useNetwork } from 'context/network';
import { useDaoBalances } from 'hooks/useDaoBalances';
import { useDaoDetailsQuery } from 'hooks/useDaoDetails';
import { useDaoMembers } from 'hooks/useDaoMembers';
import { PluginTypes } from 'hooks/usePluginClient';
import { usePluginSettings } from 'hooks/usePluginSettings';
import { fetchTokenPrice } from 'services/prices';
import { formatUnits } from 'utils/library';
import {
  ActionIndex,
  ActionItem,
  ActionsTypes,
  BaseTokenInfo,
} from 'utils/types';
import AddAddresses from './addAddresses';
import MintTokens from './mintTokens';
import RemoveAddresses from './removeAddresses';
import UpdateMinimumApproval from './updateMinimumApproval';
import WithdrawAction from './withdraw/withdrawAction';
import AddMemberAction from './addMember/addMemberAction';
import CreditDelegationAction from './creditDelegation/creditDelegationAction';
import SwapTokensAction from './swapTokens/swapTokensAction';
import SCC from 'containers/smartContractComposer';
import SCCAction from './scc';
import CreateGroupAction from './createGroup';
import ProvideLiquidityAction from './provideLiquidity/provideLiquidityAction';
import BudgetAllocationAction from './budgetAllocation';

/**
 * This Component is responsible for generating all actions that append to pipeline context (actions)
 * In future we can add more action template like: mint token Component
 * or custom action component (for smart contracts methods)
 * @returns List of actions
 */

type ActionsComponentProps = {
  name: ActionsTypes;
  allowRemove?: boolean;
} & ActionIndex;

const Action: React.FC<ActionsComponentProps> = ({
  name,
  actionIndex,
  allowRemove = true,
}) => {
  // dao data
  const { data: daoDetails } = useDaoDetailsQuery();

  // plugin data
  const { data: votingSettings } = usePluginSettings(
    daoDetails?.plugins.find(
      (plugin: any) => plugin.id.includes("token-voting") || plugin.id.includes("multisig.plugin")
    )?.instanceAddress as string,
    daoDetails?.plugins.find(
      (plugin: any) => plugin.id.includes("token-voting") || plugin.id.includes("multisig.plugin")
    )?.id as PluginTypes
  );
  const { data: daoMembers } = useDaoMembers(
    daoDetails?.plugins?.[0]?.instanceAddress || '',
    (daoDetails?.plugins?.[0]?.id as PluginTypes) || undefined
  );
  const multisigDAOSettings = votingSettings as MultisigVotingSettings;

  switch (name) {
    case 'withdraw_assets':
      return <WithdrawAction {...{ actionIndex, allowRemove }} />;
    case 'credit_delegation':
      return <CreditDelegationAction {...{ actionIndex, allowRemove }} />;
    case 'swap_tokens':
      return <SwapTokensAction {...{ actionIndex, allowRemove }} />;
    case 'provide_liquidity':
      return <ProvideLiquidityAction {...{ actionIndex, allowRemove }} />;
    case 'budget_allocation':
      return <BudgetAllocationAction {...{ actionIndex, allowRemove }} />;
    case 'create_group':
      return <CreateGroupAction {...{ actionIndex }} />;
    case 'add_member':
      return <AddMemberAction {...{ actionIndex, allowRemove }} />;
    case 'mint_tokens':
      return <MintTokens {...{ actionIndex, allowRemove }} />;
    case 'external_contract_modal':
      return <SCC actionIndex={actionIndex} />;
    case 'external_contract_action':
      return <SCCAction actionIndex={actionIndex} allowRemove={allowRemove} />;
    case 'modify_token_voting_settings':
      return (
        <TemporarySection purpose="It serves as a placeholder for not yet implemented external contract interaction component" />
      );
    case 'add_address':
      return (
        <AddAddresses
          actionIndex={actionIndex}
          currentDaoMembers={daoMembers?.members}
          allowRemove={allowRemove}
        />
      );
    case 'remove_address':
      return (
        <RemoveAddresses
          actionIndex={actionIndex}
          currentDaoMembers={daoMembers?.members}
          allowRemove={allowRemove}
        />
      );
    case 'modify_multisig_voting_settings':
      return (
        <UpdateMinimumApproval
          actionIndex={actionIndex}
          currentDaoMembers={daoMembers?.members}
          currentMinimumApproval={multisigDAOSettings?.minApprovals}
        />
      );
    default:
      throw Error('Action not found');
  }
};

interface ActionBuilderProps {
  allowEmpty?: boolean;
}

const ActionBuilder: React.FC<ActionBuilderProps> = ({ allowEmpty = true }) => {
  const { data: daoDetails } = useDaoDetailsQuery();
  const { network } = useNetwork();
  const { selectedActionIndex: index, actions } = useActionsContext();
  const { data: tokens } = useDaoBalances(daoDetails?.address || '');
  const { setValue, resetField, clearErrors } = useFormContext();

  /*************************************************
   *             Callbacks and Handlers            *
   *************************************************/

  const handleTokenSelect = (token: BaseTokenInfo) => {
    setValue(`actions.${index}.tokenSymbol`, token.symbol);

    if (token.address === '') {
      setValue(`actions.${index}.isCustomToken`, true);
      resetField(`actions.${index}.tokenName`);
      resetField(`actions.${index}.tokenImgUrl`);
      resetField(`actions.${index}.tokenAddress`);
      resetField(`actions.${index}.tokenBalance`);
      clearErrors(`actions.${index}.amount`);
      return;
    }

    clearErrors([
      `actions.${index}.tokenAddress`,
      `actions.${index}.tokenSymbol`,
    ]);
    setValue(`actions.${index}.isCustomToken`, false);
    setValue(`actions.${index}.tokenName`, token.name);
    setValue(`actions.${index}.tokenImgUrl`, token.imgUrl);
    setValue(`actions.${index}.tokenAddress`, token.address);
    setValue(`actions.${index}.tokenDecimals`, token.decimals);

    setValue(
      `actions.${index}.tokenBalance`,
      formatUnits(token.count, token.decimals)
    );

    fetchTokenPrice(token.address, network, token.symbol).then(price => {
      setValue(`actions.${index}.tokenPrice`, price);
    });
  };

  return (
    <>
      {actions?.map((action: ActionItem, index: number) => (
        <Action
          key={index}
          name={action?.name}
          actionIndex={index}
          allowRemove={actions.length <= 1 ? allowEmpty : true}
        />
      ))}

      <TokenMenu
        isWallet={false}
        onTokenSelect={handleTokenSelect}
        tokenBalances={tokens || []}
      />
    </>
  );
};

export default ActionBuilder;
