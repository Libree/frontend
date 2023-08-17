import React, {useMemo} from 'react';
import {DaoDetails} from '@aragon/sdk-client';
import {SupportedVotingSettings} from 'utils/types';
import {useTranslation} from 'react-i18next';
import {FullScreenStepper, Step} from 'components/fullScreenStepper';
import {Marketplace} from 'utils/paths';
import FundOpportunityStepTwo from 'containers/marketplace/fundOpportunityStepTwo';
import SetupVotingForm, {
  isValid as setupVotingIsValid,
} from 'containers/setupVotingForm';
import DefineProposal, {
  isValid as defineProposalIsValid,
} from 'containers/defineProposal';
import ReviewProposal from 'containers/reviewProposal';
import {useFormContext, useFormState, useWatch} from 'react-hook-form';
import ConfigureActions from 'containers/configureActions';

type FundOpportunityStepperProps = {
  enableTxModal: () => void;
  daoDetails: DaoDetails;
  pluginSettings: SupportedVotingSettings;
};

const FundOpportunityStepper: React.FC<FundOpportunityStepperProps> = ({
  enableTxModal,
  pluginSettings,
}) => {
  const {t} = useTranslation();
  const {control} = useFormContext();
  const {errors, dirtyFields} = useFormState({control: control});
  const [fundingSource, collateralType] = useWatch({
    control: control,
    name: ['actions.0.inputs.fundingSource', 'actions.0.inputs.collateralType'],
  });

  /*************************************************
   *             Step Validation States            *
   *************************************************/
  const stepOneIsValid = useMemo(() => {
    if (!fundingSource || !collateralType) return false;
    return true;
  }, [fundingSource, collateralType]);

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
          <ConfigureActions
            label=""
            initialActions={['fund_opportunity']}
            disableAddAction
            hideAlert
            allowEmpty={false}
          />
        </Step>
        <Step isNextButtonDisabled={!stepTwoIsValid}>
          <FundOpportunityStepTwo />
        </Step>
        <Step
          wizardTitle={t('marketplace.setupVoting.title')}
          wizardDescription={t('marketplace.setupVoting.description')}
          isNextButtonDisabled={!setupVotingIsValid(errors)}
        >
          <SetupVotingForm pluginSettings={pluginSettings} />
        </Step>
        <Step
          wizardTitle={t('marketplace.defineProposal.heading')}
          wizardDescription={t('marketplace.defineProposal.description')}
          isNextButtonDisabled={!defineProposalIsValid(dirtyFields, errors)}
        >
          <DefineProposal />
        </Step>
        <Step
          wizardTitle={t('marketplace.reviewProposal.heading')}
          wizardDescription={t('marketplace.reviewProposal.description')}
          nextButtonLabel={t('labels.submitProposal')}
          onNextButtonClicked={() => enableTxModal()}
          fullWidth
        >
          <ReviewProposal defineProposalStepNumber={3} />
        </Step>
      </FullScreenStepper>
    </>
  );
};

export default FundOpportunityStepper;
