import {
    IllustrationHuman,
    Breadcrumb,
    ButtonText,
    IlluObject,
} from '@aragon/ui-components';
import { withTransaction } from '@elastic/apm-rum-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import GroupList from 'components/groupList';
import {
    GroupSectionWrapper,
    PageWrapper,
} from 'components/wrappers';
import { useMappedBreadcrumbs } from 'hooks/useMappedBreadcrumbs';
import useScreen from 'hooks/useScreen';
import PageEmptyState from 'containers/pageEmptyState';
import { Loading } from 'components/temporary';
import { useDaoDetailsQuery } from 'hooks/useDaoDetails';
import { htmlIn } from 'utils/htmlIn';
import { useNetwork } from 'context/network';
import { CreateGroupProposal } from 'utils/paths';

type Sign = -1 | 0 | 1;
const colors: Record<Sign, string> = {
    '-1': 'text-critical-800',
    '1': 'text-success-600',
    '0': 'text-ui-600',
};

export const groups = [
    {
        id: '01',
        name: 'NFT Group',
        description: 'Collector group finding best NFT projects to invest in',
        imgUrl: '',
        memberCount: 5,
        value: 1200,
    },
    {
        id: '02',
        name: 'Trading Group',
        description: 'Conservative trading group in Uniswap',
        imgUrl: '',
        memberCount: 15,
        value: 4200,
    },
    {
        id: '03',
        name: 'Research',
        description: 'Doing research to find best DeFi projects',
        imgUrl: '',
        memberCount: 2,
        value: 2200,
    },
];

const CommunityGroups: React.FC = () => {
    const { t } = useTranslation();
    const { isLoading } = useDaoDetailsQuery();
    const { isMobile, isDesktop } = useScreen();

    // load dao details
    const navigate = useNavigate();
    const { breadcrumbs, icon, tag } = useMappedBreadcrumbs();
    const { network } = useNetwork();
    const { dao } = useParams();

    /*************************************************
     *                    Render                     *
     *************************************************/
    if (isLoading) {
        return <Loading />;
    }

    if (groups.length === 0 && isDesktop)
        return (
            <PageEmptyState
                title={t('community.groups.emptyState.title')}
                subtitle={htmlIn(t)('community.groups.emptyState.description')}
                Illustration={
                    <div className="flex">
                        <IllustrationHuman
                            {...{
                                body: 'chart',
                                expression: 'excited',
                                hair: 'bun',
                            }}
                            {...(isMobile
                                ? { height: 165, width: 295 }
                                : { height: 225, width: 400 })}
                        />
                        <IlluObject object={'wallet'} className="-ml-36" />
                    </div>
                }
                buttonLabel={t('labels.newGroup')}
                onClick={() => navigate(generatePath(CreateGroupProposal, {network: network, dao: dao}))}
            />
        );

    return (
        <>
            <PageWrapper
                customHeader={
                    <HeaderContainer>
                        <Header>
                            {!isDesktop && (
                                <Breadcrumb
                                    icon={icon}
                                    crumbs={breadcrumbs}
                                    tag={tag}
                                    onClick={navigate}
                                />
                            )}

                            {/* Main */}
                            <ContentContainer>

                                {/* Button */}
                                <ButtonText
                                    size="large"
                                    label={t('labels.newGroup')}
                                    className="w-full tablet:w-auto"
                                    onClick={() => navigate(generatePath(CreateGroupProposal, {network: network, dao: dao}))}
                                />
                            </ContentContainer>
                        </Header>
                    </HeaderContainer>
                }
            >
                {groups.length === 0 ? (
                    <PageEmptyState
                        title={t('community.groups.emptyState.title')}
                        subtitle={htmlIn(t)('community.groups.emptyState.description')}
                        Illustration={
                            <div className="flex">
                                <IllustrationHuman
                                    {...{
                                        body: 'chart',
                                        expression: 'excited',
                                        hair: 'bun',
                                    }}
                                    {...(isMobile
                                        ? { height: 165, width: 295 }
                                        : { height: 225, width: 400 })}
                                />
                                <IlluObject object={'wallet'} className="-ml-32" />
                            </div>
                        }
                        buttonLabel={t('labels.newGroup')}
                        onClick={() => navigate(generatePath(CreateGroupProposal, {network: network, dao: dao}))}
                    />
                ) : (
                    <>
                        <div className={'h-4'} />
                        <GroupSectionWrapper title={t('community.groups.groupsSection')}>
                            <ListContainer>
                                <GroupList groups={groups.slice(0, 5)} />
                            </ListContainer>
                        </GroupSectionWrapper>
                    </>
                )}
            </PageWrapper>
        </>
    );
};

export default withTransaction('CommunityGroups', 'component')(CommunityGroups);

const ListContainer = styled.div.attrs({
    className: 'py-2 space-y-2',
})``;

const HeaderContainer = styled.div.attrs({
    className:
        'col-span-full desktop:col-start-3 desktop:col-end-11 -mx-2 tablet:mx-0 tablet:mt-3',
})``;

const Header = styled.div.attrs({
    className: `p-2 desktop:p-0 pb-3 desktop:mt-5 space-y-2 tablet:space-y-3 
     bg-ui-0 desktop:bg-transparent tablet:rounded-xl tablet:border
     tablet:border-ui-100 desktop:border-none tablet:shadow-100 desktop:shadow-none`,
})``;

const ContentContainer = styled.div.attrs({
    className: `flex flex-col tablet:flex-row tablet:gap-x-6 gap-y-2 
       tablet: gap - y - 3 tablet: items - start desktop: items - center desktop:justify-end`,
})``;
