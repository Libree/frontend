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
import { Finance } from 'utils/paths';
import { SupportedVotingSettings } from 'utils/types';
import ConfigureActions from 'containers/configureActions';
import { actionsAreValid } from 'utils/validators';
import { useActionsContext } from 'context/actions';
import { DaoDetails } from '@aragon/sdk-client';

interface AddMemberStepperProps {
    enableTxModal: () => void;
    daoDetails: DaoDetails;
    pluginSettings: SupportedVotingSettings;
}

const AddMemberStepper: React.FC<AddMemberStepperProps> = ({
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
                wizardProcessName={t('labels.addMembers')}
                navLabel={t('allTransfer.newTransfer')}
                processType="ProposalCreation"
                returnPath={generatePath(Finance, {
                    network,
                    dao: toDisplayEns(daoDetails?.ensDomain) || daoDetails?.address,
                })}
            >
                <Step
                    wizardTitle={t('labels.addMembers')}
                    wizardDescription={t('addMember.description')}
                    isNextButtonDisabled={
                        !actions.length || !actionsAreValid(formActions, actions, errors)
                    }
                >
                    <ConfigureActions
                        label=""
                        initialActions={['add_member']}
                        whitelistedActions={['add_member']}
                        addExtraActionLabel={t(
                            'addMember.ctaAddAnother'
                        )}
                        onAddExtraActionClick={() => {
                            addAction({ name: 'add_member' });
                        }}
                        hideAlert
                        allowEmpty={false}
                    />
                </Step>
                <Step
                    wizardTitle={t('addMember.setupVoting.title')}
                    wizardDescription={t('addMember.setupVoting.description')}
                    isNextButtonDisabled={!setupVotingIsValid(errors)}
                >
                    <SetupVotingForm pluginSettings={pluginSettings} />
                </Step>
                <Step
                    wizardTitle={t('addMember.defineProposal.heading')}
                    wizardDescription={t('addMember.defineProposal.description')}
                    isNextButtonDisabled={!defineProposalIsValid(dirtyFields, errors)}
                >
                    <DefineProposal />
                </Step>
                <Step
                    wizardTitle={t('addMember.reviewProposal.heading')}
                    wizardDescription={t('addMember.reviewProposal.description')}
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

export default AddMemberStepper;
