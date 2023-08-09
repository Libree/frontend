import React, { useState } from 'react';
import { withTransaction } from '@elastic/apm-rum-react';
import { FormProvider, useForm } from 'react-hook-form';

import { CreateProposalProvider } from 'context/createProposal';
import FundOpportunityStepper from 'containers/fundOpportunityStepper';
import { PluginTypes } from 'hooks/usePluginClient';
import { useDaoDetailsQuery } from 'hooks/useDaoDetails';
import { usePluginSettings } from 'hooks/usePluginSettings';
import { Loading } from 'components/temporary';

export type FundingSource = 'DAO' | 'AAVE';

export type CollateralType = 'ERC20' | 'NFT';

export type IsPersistent = 'Yes' | 'No';

export type CreateFundOpportunityFormData = {
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
};

const defaultValues = {
    collateralAddress: '',
    principalAsset: '',
    borrower: '',
};

const FundOpportunity: React.FC = () => {
    const [showTxModal, setShowTxModal] = useState(false);

    const { data: daoDetails, isLoading: detailsLoading } = useDaoDetailsQuery();
    const { data: pluginSettings, isLoading: settingsLoading } = usePluginSettings(
        daoDetails?.plugins.find(
            plugin => plugin.id.includes("token-voting") || plugin.id.includes("multisig.plugin")
        )?.instanceAddress as string,
        daoDetails?.plugins.find(
            plugin => plugin.id.includes("token-voting") || plugin.id.includes("multisig.plugin")
        )?.id as PluginTypes
    );

    const formMethods = useForm<CreateFundOpportunityFormData>({
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
        </FormProvider>
    );
};

export default withTransaction('FundOpportunity', 'component')(FundOpportunity);
