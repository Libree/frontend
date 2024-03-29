import React from 'react';

import { useDaoDetailsQuery } from 'hooks/useDaoDetails';
import { Action, InterestRateType } from 'utils/types';
import { AddAddressCard } from './actions/addAddressCard';
import { MintTokenCard } from './actions/mintTokenCard';
import { ModifyMetadataCard } from './actions/modifyMetadataCard';
import { ModifyMultisigSettingsCard } from './actions/modifyMultisigSettingsCard';
import { ModifyMvSettingsCard } from './actions/modifySettingsCard';
import { RemoveAddressCard } from './actions/removeAddressCard';
import { WithdrawCard } from './actions/withdrawCard';
import { AddMemberCard } from './actions/addMemberCard';
import { SCCExecutionCard } from './actions/sccExecutionWidget';
import { CreditDelegationCard } from './actions/creditDelegationCard';
import { CreateGroupCard } from './actions/createGroupCard';
import { SwapTokensCard } from './actions/swapTokensCard';
import { ProvideLiquidityCard } from './actions/provideLiquidityCard';
import { BudgetAllocationCard } from './actions/budgetAllocationCard';
import { FundOpportunityCard } from './actions/fundOpportunityCard';
import { LoanOfferCard } from './actions/loanOfferCard';

type ActionsFilterProps = {
  action: Action;
};

export const ActionsFilter: React.FC<ActionsFilterProps> = ({ action }) => {
  const { data: dao } = useDaoDetailsQuery();
  // all actions have names
  switch (action.name) {
    case 'withdraw_assets':
      return (
        <WithdrawCard action={action} daoName={dao?.metadata?.name || ''} />
      );
    case 'create_group':
      return <CreateGroupCard action={action} />;
    case 'add_member':
      return <AddMemberCard action={action} />;
    case 'credit_delegation':
      return <CreditDelegationCard action={action} />;
    case 'swap_tokens':
      return <SwapTokensCard action={action} />;
    case 'provide_liquidity':
      return <ProvideLiquidityCard action={action} />;
    case 'budget_allocation':
      return <BudgetAllocationCard action={action} />;
    case 'add_address':
      return <AddAddressCard action={action} />;
    case 'remove_address':
      return <RemoveAddressCard action={action} />;
    case 'mint_tokens':
      return <MintTokenCard action={action} />;
    case 'fund_opportunity':
      return <FundOpportunityCard action={action} />;
    case 'loan_offer':
      return <> {action.inputs.fundingSource === 'AAVESTABLE' || action.inputs.fundingSource === 'AAVEVARIABLE'
        ?
        <>
          <CreditDelegationCard action={{
            name: 'credit_delegation',
            inputs: {
              amount: action.inputs.loanAmount,
              interestRateType: action.inputs.fundingSource === 'AAVESTABLE' ? InterestRateType.STABLE : InterestRateType.VARIABLE,
              token: action.inputs.principalAsset,
              user: action.inputs.pwnPluginAddress
            }
          }} />
          <LoanOfferCard action={action} />
        </>
        :
        <LoanOfferCard action={action} />
      } </>;
    case 'modify_metadata':
      return <ModifyMetadataCard action={action} />;
    case 'modify_token_voting_settings':
      return <ModifyMvSettingsCard action={action} />;
    case 'modify_multisig_voting_settings':
      return <ModifyMultisigSettingsCard action={action} />;
    case 'external_contract_action':
      return <SCCExecutionCard action={action} />;
    default:
      return <></>;
  }
};
