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
import AddMemberStepper from 'containers/addMemberStepper';

export type TokenFormData = {
    tokenName: string;
    tokenSymbol: string;
    tokenImgUrl: string;
    tokenAddress: string;
    tokenDecimals: number;
    tokenBalance: string;
    tokenPrice?: number;
    isCustomToken: boolean;
};

export type AddMemberAction = TokenFormData & {
    to: InputValue;
    from: string;
    amount: string;
    name: string; // This indicates the type of action; Deposit is NOT an action
};

type AddMemberFormData = {
    actions: AddMemberAction[];

    // Proposal data
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    duration: number;
    startUtc: string;
    endUtc: string;
    durationSwitch: string;
    proposalTitle: string;
    proposalSummary: string;
    proposal: unknown;
    links: unknown;
};

export const defaultValues = {
    links: [{ name: '', url: '' }],
    startSwitch: 'now',
    durationSwitch: 'duration',
    actions: [],
};

const AddMember: React.FC = () => {
    const [showTxModal, setShowTxModal] = useState(false);

    const { data: daoDetails, isLoading: detailsLoading } = useDaoDetailsQuery();
    const { data: pluginSettings, isLoading: settingsLoading } = usePluginSettings(
        daoDetails?.plugins[0].instanceAddress as string,
        daoDetails?.plugins[0].id as PluginTypes
    );

    const formMethods = useForm<AddMemberFormData>({
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
                        <AddMemberStepper
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

export default withTransaction('AddMember', 'component')(AddMember);
