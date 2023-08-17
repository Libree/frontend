import React, {useState} from 'react';
import {withTransaction} from '@elastic/apm-rum-react';
import {FormProvider, useForm} from 'react-hook-form';

import {CreateProposalProvider} from 'context/createProposal';
import FundOpportunityStepper from 'containers/fundOpportunityStepper';
import {PluginTypes} from 'hooks/usePluginClient';
import {useDaoDetailsQuery} from 'hooks/useDaoDetails';
import {usePluginSettings} from 'hooks/usePluginSettings';
import {Loading} from 'components/temporary';
import {ActionsProvider} from 'context/actions';
import {
  CollateralType,
  FundingSource,
  InterestRateType,
  IsPersistent,
} from 'utils/types';

export type FundOpportunityAction = {
  name: 'fund_opportunity';
  inputs: {
    fundingSource: FundingSource;
    collateralType: CollateralType;

    collateralAddress: string;
    collateralAmount: number;
    collateralId: number;
    principalAsset: string;
    loanAmount: number;
    loanYield: number;
    durationTime: number;
    expirationTime: number;
    borrower: string;
    isPersistent: IsPersistent;
    interestRateType?: InterestRateType;
  };
};

type FundOpportunityFormData = {
  actions: FundOpportunityAction[];
};

const defaultValues = {
  actions: [],
};

const FundOpportunity: React.FC = () => {
  const [showTxModal, setShowTxModal] = useState(false);

  const {data: daoDetails, isLoading: detailsLoading} = useDaoDetailsQuery();
  const {data: pluginSettings, isLoading: settingsLoading} = usePluginSettings(
    daoDetails?.plugins.find(
      plugin =>
        plugin.id.includes('token-voting') ||
        plugin.id.includes('multisig.plugin')
    )?.instanceAddress as string,
    daoDetails?.plugins.find(
      plugin =>
        plugin.id.includes('token-voting') ||
        plugin.id.includes('multisig.plugin')
    )?.id as PluginTypes
  );

  const formMethods = useForm<FundOpportunityFormData>({
    mode: 'onChange',
    defaultValues,
  });

  /*************************************************
   *                    Render                     *
   *************************************************/
  if (!daoDetails || !pluginSettings || detailsLoading || settingsLoading) {
    return <Loading />;
  }

  return (
    <FormProvider {...formMethods}>
      <ActionsProvider daoId={daoDetails?.address as string}>
        <CreateProposalProvider
          showTxModal={showTxModal}
          setShowTxModal={setShowTxModal}
        >
          <FundOpportunityStepper
            daoDetails={daoDetails}
            pluginSettings={pluginSettings}
            enableTxModal={() => setShowTxModal(true)}
          />
        </CreateProposalProvider>
      </ActionsProvider>
    </FormProvider>
  );
};

export default withTransaction('FundOpportunity', 'component')(FundOpportunity);
