import { withTransaction } from '@elastic/apm-rum-react';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Loading } from 'components/temporary';
import { ActionsProvider } from 'context/actions';
import { CreateProposalProvider } from 'context/createProposal';
import { useDaoDetailsQuery } from 'hooks/useDaoDetails';
import { PluginTypes } from 'hooks/usePluginClient';
import { usePluginSettings } from 'hooks/usePluginSettings';
import BudgetAllocationStepper from 'containers/budgetAllocationStepper'

export type BudgetAllocationAction = {
    name: string; // This indicates the type of action;
};

type BudgetAllocationFormData = {
    actions: BudgetAllocationAction[];
};

export const defaultValues = {
    actions: [],
};

const BudgetAllocation: React.FC = () => {
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

    const formMethods = useForm<BudgetAllocationFormData>({
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
                        <BudgetAllocationStepper
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

export default withTransaction('BudgetAllocation', 'component')(BudgetAllocation);
