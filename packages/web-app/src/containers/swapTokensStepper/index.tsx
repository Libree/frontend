import React from 'react';
import { useFormContext, useFormState, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FullScreenStepper, Step } from 'components/fullScreenStepper';
import ReviewWithoutLinks from 'containers/review';
import { useNetwork } from 'context/network';
import { generatePath } from 'react-router-dom';
import { toDisplayEns } from 'utils/library';
import { Finance } from 'utils/paths';
import { SupportedVotingSettings } from 'utils/types';
import ConfigureActions from 'containers/configureActions';
import { actionsAreValid } from 'utils/validators';
import { useActionsContext } from 'context/actions';
import { DaoDetails } from '@aragon/sdk-client';

interface SwapTokensStepperProps {
    enableTxModal: () => void;
    daoDetails: DaoDetails;
    pluginSettings: SupportedVotingSettings;
}

const SwapTokensStepper: React.FC<SwapTokensStepperProps> = ({
    enableTxModal,
    daoDetails,
}) => {
    const { t } = useTranslation();
    const { network } = useNetwork();
    const { actions, addAction } = useActionsContext();

    const { control } = useFormContext();

    const { errors } = useFormState({ control: control });

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
                wizardProcessName={t('swapTokens.title')}
                navLabel={t('swapTokens.subtitle')}
                processType="ProposalCreation"
                returnPath={generatePath(Finance, {
                    network,
                    dao: toDisplayEns(daoDetails?.ensDomain) || daoDetails?.address,
                })}
            >
                <Step
                    wizardTitle={t('swapTokens.subtitle')}
                    wizardDescription={t('swapTokens.description')}
                    isNextButtonDisabled={
                        !actions.length || !actionsAreValid(formActions, actions, errors)
                    }
                >
                    <ConfigureActions
                        label=""
                        initialActions={['swap_tokens']}
                        whitelistedActions={['swap_tokens']}
                        addExtraActionLabel={t(
                            'swapTokens.ctaAddAnother'
                        )}
                        onAddExtraActionClick={() => {
                            addAction({ name: 'swap_tokens' });
                        }}
                        hideAlert
                        allowEmpty={false}
                    />
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
                    <ReviewWithoutLinks />
                </Step>
            </FullScreenStepper>
        </>
    );
};

export default SwapTokensStepper;