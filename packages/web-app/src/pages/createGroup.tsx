import { withTransaction } from '@elastic/apm-rum-react';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Loading } from 'components/temporary';
import { ActionsProvider } from 'context/actions';
import { CreateProposalProvider } from 'context/createProposal';
import { useDaoDetailsQuery } from 'hooks/useDaoDetails';
import { PluginTypes } from 'hooks/usePluginClient';
import { usePluginSettings } from 'hooks/usePluginSettings';
import CreateGroupStepper from 'containers/createGroupStepper';

export type CreateGroupAction = {
    name: string; // This indicates the type of action;
};

type CreateGroupFormData = {
    actions: CreateGroupAction[];
    groupName: string;
    addresses: string[];
};

export const defaultValues = {
    actions: [],
    groupName: '',
    addresses: [],
};

const CreateGroup: React.FC = () => {
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

    const formMethods = useForm<CreateGroupFormData>({
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
                        <CreateGroupStepper
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

export default withTransaction('CreateGroup', 'component')(CreateGroup);
