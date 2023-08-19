import React from 'react';
import { useFormContext, useFormState, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FullScreenStepper, Step } from 'components/fullScreenStepper';
import DefineProposal, {
    isValid as defineProposalIsValid,
} from 'containers/defineProposal';
import ReviewProposal from 'containers/reviewProposal';
import SetupVotingForm, {
    isValid as setupVotingIsValid,
} from 'containers/setupVotingForm';
import { useNetwork } from 'context/network';
import { generatePath } from 'react-router-dom';
import { toDisplayEns } from 'utils/library';
import { Marketplace } from 'utils/paths';
import { SupportedVotingSettings } from 'utils/types';
import ConfigureActions from 'containers/configureActions';
import { actionsAreValid } from 'utils/validators';
import { useActionsContext } from 'context/actions';
import { DaoDetails } from '@aragon/sdk-client';

interface LoanOfferStepperProps {
    enableTxModal: () => void;
    daoDetails: DaoDetails;
    pluginSettings: SupportedVotingSettings;
}

const LoanOfferStepper: React.FC<LoanOfferStepperProps> = ({
    enableTxModal,
    daoDetails,
    pluginSettings,
}) => {
    const { t } = useTranslation();
    const { network } = useNetwork();
    const { actions, addAction } = useActionsContext();
    const { control } = useFormContext();
    const { errors, dirtyFields } = useFormState({ control: control });

    const [formActions] = useWatch({
        name: ['actions'],
        control,
    });

    /*************************************************
     *                    Render                     *
     *************************************************/

    return (
        <>
            <FullScreenStepper
                wizardProcessName={t('loanOffer.processName')}
                navLabel={t('loanOffer.title')}
                processType="ProposalCreation"
                returnPath={generatePath(Marketplace, {
                    network,
                    dao: toDisplayEns(daoDetails?.ensDomain) || daoDetails?.address,
                })}
            >
                <Step
                    wizardTitle={t('loanOffer.title')}
                    wizardDescription={t('loanOffer.description')}
                    isNextButtonDisabled={
                        !actions.length || !actionsAreValid(formActions, actions, errors)
                    }
                >
                    <ConfigureActions
                        label=""
                        initialActions={['loan_offer']}
                        whitelistedActions={['loan_offer']}
                        addExtraActionLabel={t(
                            'loanOffer.ctaAddAnother'
                        )}
                        onAddExtraActionClick={() => {
                            addAction({ name: 'loan_offer' });
                        }}
                        hideAlert
                        allowEmpty={false}
                    />
                </Step>
                <Step
                    wizardTitle={t('createGroup.setupVoting.title')}
                    wizardDescription={t('createGroup.setupVoting.description')}
                    isNextButtonDisabled={!setupVotingIsValid(errors)}
                >
                    <SetupVotingForm pluginSettings={pluginSettings} />
                </Step>
                <Step
                    wizardTitle={t('createGroup.defineProposal.heading')}
                    wizardDescription={t('createGroup.defineProposal.description')}
                    isNextButtonDisabled={!defineProposalIsValid(dirtyFields, errors)}
                >
                    <DefineProposal />
                </Step>
                <Step
                    wizardTitle={t('createGroup.reviewProposal.heading')}
                    wizardDescription={t('createGroup.reviewProposal.description')}
                    nextButtonLabel={t('labels.submitProposal')}
                    onNextButtonClicked={() => {
                        enableTxModal();
                    }}
                    fullWidth
                >
                    <ReviewProposal defineProposalStepNumber={3} />
                </Step>
            </FullScreenStepper>
        </>
    );
};

export default LoanOfferStepper;