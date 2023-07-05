import { withTransaction } from '@elastic/apm-rum-react';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Loading } from 'components/temporary';
import { ActionsProvider } from 'context/actions';
import { CreateProposalProvider } from 'context/createProposal';
import { useDaoDetailsQuery } from 'hooks/useDaoDetails';
import { PluginTypes } from 'hooks/usePluginClient';
import { usePluginSettings } from 'hooks/usePluginSettings';
import { InputValue } from '@aragon/ui-components';
import CreditDelegationStepper from 'containers/creditDelegationStepper';

export type CreditDelegationAction = {
    to: InputValue;
    from: string;
    amount: string;
    name: string; // This indicates the type of action; Deposit is NOT an action
};

type CreditDelegationFormData = {
    actions: CreditDelegationAction[];
};

export const defaultValues = {
    actions: [],
    inputs: [],
};

const NewCreditDelegation: React.FC = () => {
    const [showTxModal, setShowTxModal] = useState(false);

    const { data: daoDetails, isLoading: detailsLoading } = useDaoDetailsQuery();
    const { data: pluginSettings, isLoading: settingsLoading } = usePluginSettings(
        daoDetails?.plugins[0].instanceAddress as string,
        daoDetails?.plugins[0].id as PluginTypes
    );

    const formMethods = useForm<CreditDelegationFormData>({
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
                        <CreditDelegationStepper
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

export default withTransaction('NewCreditDelegation', 'component')(NewCreditDelegation);
