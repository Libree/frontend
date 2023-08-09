import React, { useMemo } from "react";
import { DaoDetails } from "@aragon/sdk-client";
import { SupportedVotingSettings } from "utils/types";
import { useTranslation } from "react-i18next";
import { FullScreenStepper, Step } from "components/fullScreenStepper";
import { Marketplace } from "utils/paths";
import FundOpportunityStepOne from "containers/marketplace/fundOpportunityStepOne";
import FundOpportunityStepTwo from "containers/marketplace/fundOpportunityStepTwo";
import DefineProposal, {
    isValid as defineProposalIsValid,
} from 'containers/defineProposal';
import ReviewProposal from "containers/reviewProposal";
import { useFormContext, useFormState, useWatch } from "react-hook-form";

type FundOpportunityStepperProps = {
    enableTxModal: () => void;
    daoDetails: DaoDetails;
    pluginSettings: SupportedVotingSettings
};

const FundOpportunityStepper: React.FC<FundOpportunityStepperProps> = ({
    enableTxModal,
    daoDetails,
    pluginSettings,
}) => {
    const { t } = useTranslation();
    const { control } = useFormContext();
    const { errors, dirtyFields } = useFormState({ control: control });
    const [
        fundingSource,
        collateralType,
    ] = useWatch({
        control: control,
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

    const stepTwoIsValid = useMemo(() => {
        return true;
    }, []);

    return (
        <>
            <FullScreenStepper
                wizardProcessName={t('marketplace.fundOpportunity.headerTitle')}
                navLabel={t('marketplace.fundOpportunity.headerTitle')}
                returnPath={Marketplace}
            >
                <Step isNextButtonDisabled={!stepOneIsValid}>
                    <FundOpportunityStepOne />
                </Step>
                <Step isNextButtonDisabled={!stepTwoIsValid}>
                    <FundOpportunityStepTwo />
                </Step>
                <Step
                    wizardTitle={t('creditDelegation.defineProposal.heading')}
                    wizardDescription={t('creditDelegation.defineProposal.description')}
                    isNextButtonDisabled={!defineProposalIsValid(dirtyFields, errors)}
                >
                    <DefineProposal />
                </Step>
                <Step
                    wizardTitle={t('creditDelegation.reviewProposal.heading')}
                    wizardDescription={t('creditDelegation.reviewProposal.description')}
                    nextButtonLabel={t('labels.submitProposal')}
                    onNextButtonClicked={() => {
                        enableTxModal();
                    }}
                    fullWidth
                >
                    <ReviewProposal
                        defineProposalStepNumber={3}
                    />
                </Step>
            </FullScreenStepper>
        </>
    )
};

export default FundOpportunityStepper;