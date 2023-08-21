import { withTransaction } from '@elastic/apm-rum-react';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Loading } from 'components/temporary';
import { ActionsProvider } from 'context/actions';
import { CreateProposalProvider } from 'context/createProposal';
import { useDaoDetailsQuery } from 'hooks/useDaoDetails';
import { PluginTypes } from 'hooks/usePluginClient';
import { usePluginSettings } from 'hooks/usePluginSettings';
import LoanOfferStepper from 'containers/loanOfferStepper';
import { CollateralType, FundingSource, InterestRateType, IsPersistent } from 'utils/types';

export type LoanOfferAction = {
    name: 'loan_offer';
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
    }
};

type LoanOfferFormData = {
    actions: LoanOfferAction[];
    groupName: string;
    addresses: string[];
};

export const defaultValues = {
    actions: [],
    groupName: '',
    addresses: [],
};

const LoanOffer: React.FC = () => {
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

    const formMethods = useForm<LoanOfferFormData>({
        defaultValues,
        mode: 'onChange',
    });

    /*************************************************
     *                    Render                     *
     *************************************************/

    if (!daoDetails || !pluginSettings || detailsLoading || settingsLoading) {
        return <Loading />;
    }

    return (
        <>
            <FormProvider {...formMethods}>
                <ActionsProvider daoId={daoDetails?.address as string}>
                    <CreateProposalProvider
                        showTxModal={showTxModal}
                        setShowTxModal={setShowTxModal}
                    >
                        <LoanOfferStepper
                            daoDetails={daoDetails}
                            pluginSettings={pluginSettings}
                            enableTxModal={() => setShowTxModal(true)}
                        />
                    </CreateProposalProvider>
                </ActionsProvider>
            </FormProvider>
        </>
    );
};

export default withTransaction('LoanOffer', 'component')(LoanOffer);
