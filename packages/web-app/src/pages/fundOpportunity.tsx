import React, { useMemo } from 'react';
import { withTransaction } from '@elastic/apm-rum-react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

import { FullScreenStepper, Step } from 'components/fullScreenStepper';
import { Marketplace } from 'utils/paths';
import FundOpportunityStepOne from 'containers/marketplace/fundOpportunityStepOne';
import FundOpportunityStepTwo from 'containers/marketplace/fundOpportunityStepTwo';

export type CreateFundOpportunityFormData = {
    fundingSource: string;
    collateralType: string;

    collateralAddress: string;
    collateralAmount: number;
    collateralId: number;
    principalAsset: string;
    loanAmount: number;
    loanYield: number;
    durationTime: number;
    expirationTime: number;
    borrower: string;
    isPersistent: string;
};

const defaultValues = {
    fundingSource: '',
    collateralType: '',

    collateralAddress: '',
    collateralAmount: 0,
    collateralId: 0,
    principalAsset: '',
    loanAmount: 0,
    loanYield: 0,
    durationTime: 0,
    expirationTime: 0,
    borrower: '',
    isPersistent: '',
};

const FundOpportunity: React.FC = () => {
    const { t } = useTranslation();
    const formMethods = useForm<CreateFundOpportunityFormData>({
        mode: 'onChange',
        defaultValues,
    });

    const [
        fundingSource,
        collateralType,
    ] = useWatch({
        control: formMethods.control,
        name: [
            'fundingSource',
            'collateralType',
        ],
    });

    /*************************************************
     *             Step Validation States            *
     *************************************************/
    const stepOneIsValid = useMemo(() => {
        if (!fundingSource || !collateralType) return false;
        return true;
    }, [
        fundingSource,
        collateralType,
    ]);

    /*************************************************
     *                    Render                     *
     *************************************************/
    return (
        <FormProvider {...formMethods}>
            <FullScreenStepper
                wizardProcessName={t('marketplace.fundOpportunity.headerTitle')}
                navLabel={t('marketplace.fundOpportunity.headerTitle')}
                returnPath={Marketplace}
            >
                <Step isNextButtonDisabled={!stepOneIsValid}>
                    <FundOpportunityStepOne />
                </Step>
                <Step>
                    <FundOpportunityStepTwo />
                </Step>
            </FullScreenStepper>
        </FormProvider>
    );
};

export default withTransaction('FundOpportunity', 'component')(FundOpportunity);
