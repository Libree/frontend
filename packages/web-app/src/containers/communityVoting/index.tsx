import { VotingMode, VotingSettings } from '@aragon/sdk-client';
import {
    ListItemAction,
} from '@aragon/ui-components';
import React, { useCallback, useEffect, useMemo } from 'react';
import {
    useFieldArray,
    useFormContext,
    useFormState,
    useWatch,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { AccordionItem, AccordionMultiple } from 'components/accordionMethod';
import { Loading } from 'components/temporary';
import ConfigureCommunity from 'containers/configureCommunity';
import { useDaoToken } from 'hooks/useDaoToken';
import { PluginTypes } from 'hooks/usePluginClient';
import { usePluginSettings } from 'hooks/usePluginSettings';
import { useTokenSupply } from 'hooks/useTokenSupply';
import { Layout } from 'pages/settings';
import { getDHMFromSeconds } from 'utils/date';
import { decodeVotingMode, formatUnits } from 'utils/library';

type CommunityVotingSetupProps = {
    daoDetails: any;
};

const CommunityVotingSetup: React.FC<CommunityVotingSetupProps> = ({ daoDetails }) => {
    const { t } = useTranslation();

    const { setValue, control } = useFormContext();
    const { fields, replace } = useFieldArray({
        name: 'daoLinks',
        control,
    });
    const { errors } = useFormState({ control });

    const { data: daoToken, isLoading: tokensAreLoading } = useDaoToken(
        daoDetails?.plugins?.[0]?.instanceAddress || ''
    );

    const { data: tokenSupply, isLoading: tokenSupplyIsLoading } = useTokenSupply(
        daoToken?.address || ''
    );

    const { data, isLoading: settingsAreLoading } = usePluginSettings(
        daoDetails?.plugins.find(
            (plugin:any) => plugin.id.includes("token-voting") || plugin.id.includes("multisig.plugin")
        )?.instanceAddress as string,
        daoDetails?.plugins.find(
            (plugin:any) => plugin.id.includes("token-voting") || plugin.id.includes("multisig.plugin")
        )?.id as PluginTypes
    );
    const daoSettings = data as VotingSettings;

    const formattedProposerAmount = Math.ceil(
        Number(
            formatUnits(
                daoSettings.minProposerVotingPower || 0,
                daoToken?.decimals || 18
            )
        )
    );
    const formattedEligibilityType = formattedProposerAmount ? 'token' : 'anyone';

    const { days, hours, minutes } = getDHMFromSeconds(daoSettings.minDuration);

    const [
        daoName,
        daoSummary,
        daoLogo,
        minimumApproval,
        minimumParticipation,
        eligibilityType,
        eligibilityTokenAmount,
        durationDays,
        durationHours,
        durationMinutes,
        resourceLinks,
        earlyExecution,
        voteReplacement,
    ] = useWatch({
        name: [
            'daoName',
            'daoSummary',
            'daoLogo',
            'minimumApproval',
            'minimumParticipation',
            'eligibilityType',
            'eligibilityTokenAmount',
            'durationDays',
            'durationHours',
            'durationMinutes',
            'daoLinks',
            'earlyExecution',
            'voteReplacement',
        ],
        control,
    });

    const controlledLinks = fields.map((field, index) => {
        return {
            ...field,
            ...(resourceLinks && { ...resourceLinks[index] }),
        };
    });

    const resourceLinksAreEqual: boolean = useMemo(() => {
        if (!daoDetails?.metadata.links || !resourceLinks) return true;

        // length validation
        const lengthDifference =
            resourceLinks.length - daoDetails.metadata.links.length;

        // links were added to form
        if (lengthDifference > 0) {
            // loop through extra links
            for (
                let i = daoDetails.metadata.links.length;
                i < resourceLinks.length;
                i++
            ) {
                // check if link is filled without error -> then consider it as a proper change
                if (
                    resourceLinks[i].name &&
                    resourceLinks[i].url &&
                    !errors.daoLinks?.[i]
                )
                    return false;
            }
        }

        // links were removed
        if (lengthDifference < 0) return false;

        // content validation (i.e. same number of links)
        for (let i = 0; i < daoDetails.metadata.links.length; i++) {
            if (
                controlledLinks[i].name !== daoDetails.metadata.links[i].name ||
                controlledLinks[i].url !== daoDetails.metadata.links[i].url
            )
                return false;
        }

        return true;
    }, [
        controlledLinks,
        daoDetails?.metadata.links,
        errors.daoLinks,
        resourceLinks,
    ]);

    // metadata setting changes
    const isMetadataChanged = (daoDetails?.metadata.name &&
        (daoName !== daoDetails.metadata.name ||
            daoSummary !== daoDetails.metadata.description ||
            daoLogo !== daoDetails.metadata.avatar ||
            !resourceLinksAreEqual)) as boolean;

    // governance
    const daoVotingMode = decodeVotingMode(
        daoSettings?.votingMode || VotingMode.STANDARD
    );

    // TODO: We need to force forms to only use one type, Number or string
    const isGovernanceChanged =
        Number(minimumParticipation) !==
        Math.round(daoSettings.minParticipation * 100) ||
        Number(minimumApproval) !==
        Math.round(daoSettings.supportThreshold * 100) ||
        Number(durationDays) !== days ||
        Number(durationHours) !== hours ||
        Number(durationMinutes) !== minutes ||
        earlyExecution !== daoVotingMode.earlyExecution ||
        voteReplacement !== daoVotingMode.voteReplacement;

    const isCommunityChanged =
        eligibilityTokenAmount !== formattedProposerAmount ||
        eligibilityType !== formattedEligibilityType;

    const setCurrentMetadata = useCallback(() => {
        setValue('daoName', daoDetails?.metadata.name);
        setValue('daoSummary', daoDetails?.metadata.description);
        setValue('daoLogo', daoDetails?.metadata.avatar);

        /**
         * FIXME - this is the dumbest workaround: because there is an internal
         * field array in 'AddLinks', conflicts arise when removing rows via remove
         * and update. While the append, remove and replace technically happens whe
         * we reset the form, a row is not added to the AddLinks component leaving
         * the component in a state where one or more rows are hidden until the Add
         * Link button is clicked. The workaround is to forcefully set empty fields
         * for each link coming from daoDetails and then replacing them with the
         * proper values
         */
        if (daoDetails?.metadata.links) {
            setValue('daoLinks', [...daoDetails.metadata.links.map(() => ({}))]);
            replace([...daoDetails.metadata.links]);
        }
    }, [
        daoDetails?.metadata.avatar,
        daoDetails?.metadata.description,
        daoDetails?.metadata.links,
        daoDetails?.metadata.name,
        setValue,
        replace,
    ]);

    const setCurrentCommunity = useCallback(() => {
        setValue('eligibilityTokenAmount', formattedProposerAmount);
        setValue('minimumTokenAmount', formattedProposerAmount);
        setValue('eligibilityType', formattedEligibilityType);
    }, [formattedEligibilityType, formattedProposerAmount, setValue]);

    const setCurrentGovernance = useCallback(() => {
        setValue('tokenTotalSupply', tokenSupply?.formatted);
        setValue('minimumApproval', Math.round(daoSettings.supportThreshold * 100));
        setValue(
            'minimumParticipation',
            Math.round(daoSettings.minParticipation * 100)
        );

        const votingMode = decodeVotingMode(
            daoSettings?.votingMode || VotingMode.STANDARD
        );

        setValue('earlyExecution', votingMode.earlyExecution);
        setValue('voteReplacement', votingMode.voteReplacement);

        setValue('durationDays', days?.toString());
        setValue('durationHours', hours?.toString());
        setValue('durationMinutes', minutes?.toString());

        // TODO: Alerts share will be added later
        setValue(
            'membership',
            daoDetails?.plugins.find(
                (plugin:any) => plugin.id.includes("token-voting") || plugin.id.includes("multisig.plugin")
            )?.id as PluginTypes === 'token-voting.plugin.dao.eth'
                ? 'token'
                : 'wallet'
        );
    }, [
        daoDetails?.plugins,
        daoSettings.supportThreshold,
        daoSettings.votingMode,
        daoSettings.minParticipation,
        days,
        hours,
        minutes,
        tokenSupply?.formatted,
        setValue,
    ]);

    const settingsUnchanged =
        !isGovernanceChanged && !isMetadataChanged && !isCommunityChanged;

    useEffect(() => {
        setValue('isMetadataChanged', isMetadataChanged);
        setValue('areSettingsChanged', isCommunityChanged || isGovernanceChanged);

        // intentionally using settingsUnchanged because it monitors all
        // the setting changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settingsUnchanged, setValue]);

    useEffect(() => {
        setCurrentMetadata();
        setCurrentCommunity();
        setCurrentGovernance();
    }, [setCurrentGovernance, setCurrentCommunity, setCurrentMetadata]);

    useEffect(() => {
        setValue('membership', 'token');
    }, [setValue]);

    const governanceAction = [
        {
            component: (
                <ListItemAction
                    title={t('settings.resetChanges')}
                    bgWhite
                    mode={isGovernanceChanged ? 'default' : 'disabled'}
                />
            ),
            callback: setCurrentGovernance,
        },
    ];

    if (settingsAreLoading || tokensAreLoading || tokenSupplyIsLoading) {
        return <Loading />;
    }

    return (
        <Layout>
            <Container>
                <AccordionMultiple defaultValue="metadata" className="space-y-3">
                    <AccordionItem
                        type="action-builder"
                        name="governance"
                        methodName={t('labels.advanced')}
                        dropdownItems={governanceAction}
                    >
                        <AccordionContent>
                            <ConfigureCommunity />
                        </AccordionContent>
                    </AccordionItem>
                </AccordionMultiple>
            </Container>
        </Layout>
    );
};

export default CommunityVotingSetup;

const Container = styled.div.attrs({
    className: 'mt-5 desktop:mt-8',
})``;

const AccordionContent = styled.div.attrs({
    className:
        'p-3 pb-6 space-y-3 bg-ui-0 border border-ui-100 rounded-b-xl border-t-0',
})``;
