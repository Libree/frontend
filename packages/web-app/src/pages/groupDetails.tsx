import {
    AlertInline,
    Pagination,
    SearchInput,
} from '@aragon/ui-components';
import { withTransaction } from '@elastic/apm-rum-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { GroupMembersList } from 'components/groupMembersList';
import { StateEmpty } from 'components/stateEmpty';
import { Loading } from 'components/temporary';
import { PageWrapper } from 'components/wrappers';
import { useDaoDetailsQuery } from 'hooks/useDaoDetails';
import { useDaoMembers } from 'hooks/useDaoMembers';
import { useDebouncedState } from 'hooks/useDebouncedState';
import { PluginTypes } from 'hooks/usePluginClient';

const MEMBERS_PER_PAGE = 20;

const GroupDetails: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [debouncedTerm, searchTerm, setSearchTerm] = useDebouncedState('');

    const { data: daoDetails, isLoading: detailsAreLoading } = useDaoDetailsQuery();
    const {
        data: { members, filteredMembers },
        isLoading: membersLoading,
    } = useDaoMembers(
        daoDetails?.plugins.find(
            plugin => plugin.id.includes("token-voting") || plugin.id.includes("multisig.plugin")
        )?.instanceAddress as string,
        daoDetails?.plugins.find(
            plugin => plugin.id.includes("token-voting") || plugin.id.includes("multisig.plugin")
        )?.id as PluginTypes,
        debouncedTerm
    );

    const totalMemberCount = members.length;
    const filteredMemberCount = filteredMembers.length;
    let displayedMembers: any[] = filteredMemberCount > 0 ? filteredMembers : members;

    displayedMembers = [
        {
            id: '0x123',
            address: '0x123',
        },
        {
            id: '0x456',
            address: '0x456',
        }
    ]

    const walletBased =
        (daoDetails?.plugins.find(
            (plugin:any) => plugin.id.includes("token-voting") || plugin.id.includes("multisig.plugin")
        )?.id as PluginTypes) === 'multisig.plugin.dao.eth';

    /*************************************************
     *                    Handlers                   *
     *************************************************/
    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value.trim());
    };

    const handlePrimaryClick = () => {
        navigate('add-member');
    };

    /*************************************************
     *                     Render                    *
     *************************************************/
    if (detailsAreLoading || membersLoading) return <Loading />;

    return (
        <PageWrapper
            title={`${totalMemberCount} ${t('labels.members')}`}
            {...(walletBased
                ? {
                    description: t('explore.explorer.walletBased'),
                    primaryBtnProps: {
                        label: t('labels.manageMember'),
                        onClick: handlePrimaryClick,
                    },
                }
                : {
                    description: t('explore.explorer.tokenBased'),
                    primaryBtnProps: {
                        label: t('labels.addMember'),
                        onClick: handlePrimaryClick,
                    },
                })}
        >
            <BodyContainer>
                <SearchAndResultWrapper>
                    {/* Search input */}
                    <InputWrapper>
                        <SearchInput
                            placeholder={t('labels.searchPlaceholder')}
                            value={searchTerm}
                            onChange={handleQueryChange}
                        />
                        {!walletBased && (
                            <AlertInline label={t('alert.tokenBasedMembers') as string} />
                        )}
                    </InputWrapper>

                    {/* Members List */}
                    {membersLoading ? (
                        <Loading />
                    ) : (
                        <>
                            {debouncedTerm !== '' && !filteredMemberCount ? (
                                <StateEmpty
                                    type="Object"
                                    mode="inline"
                                    object="magnifying_glass"
                                    title={t('labels.noResults')}
                                    description={t('labels.noResultsSubtitle')}
                                />
                            ) : (
                                <>
                                    {debouncedTerm !== '' && !membersLoading && (
                                        <ResultsCountLabel>
                                            {filteredMemberCount === 1
                                                ? t('labels.result')
                                                : t('labels.nResults', { count: filteredMemberCount })}
                                        </ResultsCountLabel>
                                    )}
                                    <GroupMembersList members={displayedMembers} />
                                </>
                            )}
                        </>
                    )}
                </SearchAndResultWrapper>

                {/* Pagination */}
                <PaginationWrapper>
                    {(displayedMembers.length || 0) > MEMBERS_PER_PAGE && (
                        <Pagination
                            totalPages={
                                Math.ceil(
                                    (displayedMembers.length || 0) / MEMBERS_PER_PAGE
                                ) as number
                            }
                            activePage={page}
                            onChange={(activePage: number) => {
                                setPage(activePage);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        />
                    )}
                </PaginationWrapper>
            </BodyContainer>
        </PageWrapper>
    );
};

const BodyContainer = styled.div.attrs({
    className: 'mt-5 desktop:space-y-8',
})``;

const SearchAndResultWrapper = styled.div.attrs({ className: 'space-y-3' })``;

const ResultsCountLabel = styled.p.attrs({
    className: 'font-bold text-ui-800 ft-text-lg',
})``;

const PaginationWrapper = styled.div.attrs({
    className: 'flex mt-8',
})``;

const InputWrapper = styled.div.attrs({
    className: 'space-y-1',
})``;

export default withTransaction('GroupDetails', 'component')(GroupDetails);
