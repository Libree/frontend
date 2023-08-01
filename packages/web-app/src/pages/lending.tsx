import {
    Breadcrumb,
} from '@aragon/ui-components';
import { withTransaction } from '@elastic/apm-rum-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import {
    PageWrapper,
    TokenSectionWrapper,
    TransferSectionWrapper,
} from 'components/wrappers';
import { useMappedBreadcrumbs } from 'hooks/useMappedBreadcrumbs';
import useScreen from 'hooks/useScreen';
import { Loading } from 'components/temporary';
import LendingTokenList from 'components/lendingTokenList';
import { useAaveData } from 'hooks/useAaveData';
import { formatUnits } from 'utils/library';

const Lending: React.FC = () => {
    const { t } = useTranslation();
    const { isDesktop } = useScreen();
    const { isLoading: isAaveLoading, healthFactor, netWorth, totalCollateral, totalDebt, reserves } = useAaveData()

    const navigate = useNavigate();
    const { breadcrumbs, icon, tag } = useMappedBreadcrumbs();

    const collateralList = reserves.filter(
        token => !token.metadata.name.includes('Debt')).map(token =>
        ({
            id: token.metadata.id,
            symbol: token.metadata.name,
            apyPercentage: token.currentLiquidityRate.toFixed(2),
            balance: Number(formatUnits(token.balance, token.metadata.decimals)).toFixed(2),
            balanceUsd: Number(token.marketData?.balanceValue).toFixed(2),
            changeType: 'Positive',
        }));

    const borrowList = reserves.filter(
        token => token.metadata.name.includes('Debt')).map(token =>
        ({
            id: token.metadata.id,
            symbol: token.metadata.name,
            apyPercentage: token.currentVariableBorrowRate.toFixed(2),
            balance: Number(formatUnits(token.balance, token.metadata.decimals)).toFixed(2),
            balanceUsd: Number(token.marketData?.balanceValue).toFixed(2),
            changeType: 'Negative',
        }));

    /*************************************************
     *                    Render                     *
     *************************************************/
    if (isAaveLoading) {
        return <Loading />;
    }

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
                                <TextContainer>
                                    <Title>
                                        {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD',
                                        }).format(netWorth)}
                                    </Title>

                                    <SubtitleContainer>
                                        <Description>{t('finance.lending.netWorth')}</Description>
                                    </SubtitleContainer>
                                </TextContainer>

                                {healthFactor as number > 0 && (
                                    <TextContainer>
                                        <Title style={{ color: '#00D16C' }}>{healthFactor}</Title>

                                        <SubtitleContainer>
                                            <Description>{t('finance.lending.healthFactor')}</Description>
                                        </SubtitleContainer>
                                    </TextContainer>
                                )}

                            </ContentContainer>
                            <ContentContainer>
                                <TextContainer>
                                    <Title>
                                        {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD',
                                        }).format(totalCollateral as number)}
                                    </Title>

                                    <SubtitleContainer>
                                        <Description>{t('finance.lending.totalCollateral')}</Description>
                                    </SubtitleContainer>
                                </TextContainer>

                                <TextContainer>
                                    <Title>
                                        {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD',
                                        }).format(totalDebt as number)}
                                    </Title>

                                    <SubtitleContainer>
                                        <Description>{t('finance.lending.totalDebt')}</Description>
                                    </SubtitleContainer>
                                </TextContainer>
                            </ContentContainer>
                        </Header>
                    </HeaderContainer>
                }
            >
                {collateralList.length === 0 && isAaveLoading ? (
                    <Loading />
                ) : (
                    <>
                        <div className={'h-4'} />
                        <TokenSectionWrapper title={t('finance.lending.yourCollateral')}>
                            <ListContainer>
                                <LendingTokenList tokens={collateralList.slice(0, 5)} />
                            </ListContainer>
                        </TokenSectionWrapper>
                        <div className={'h-4'} />
                        <TransferSectionWrapper
                            title={t('finance.lending.yourBorrows')}
                            showButton
                        >
                            <ListContainer>
                                <LendingTokenList
                                    tokens={borrowList.slice(0, 5)}
                                />
                            </ListContainer>
                        </TransferSectionWrapper>
                    </>
                )}
            </PageWrapper>
        </>
    );
};

export default withTransaction('Lending', 'component')(Lending);

const ListContainer = styled.div.attrs({
    className: 'py-2 space-y-2',
})``;

const HeaderContainer = styled.div.attrs({
    className:
        'col-span-full desktop:col-start-3 desktop:col-end-11 -mx-2 tablet:mx-0 tablet:mt-3',
})``;

const SubtitleContainer = styled.div.attrs({
    className: 'flex gap-x-1.5 items-center mt-1',
})``;

const Header = styled.div.attrs({
    className: `p-2 desktop:p-0 pb-3 desktop:mt-5 space-y-2 tablet:space-y-3 
     bg-ui-0 desktop:bg-transparent tablet:rounded-xl tablet:border
     tablet:border-ui-100 desktop:border-none tablet:shadow-100 desktop:shadow-none`,
})``;

const ContentContainer = styled.div.attrs({
    className: `flex gap-x-2 gap-y-2 tablet:gap-y-3 tablet:items-start desktop:items-center`,
})``;

const TextContainer = styled.div.attrs({
    className: 'tablet:flex-1 space-y-1 capitalize',
})``;

const Title = styled.h2.attrs({
    className: 'font-bold text-ui-800 ft-text-2xl tablet:ft-text-3xl',
})``;

const Description = styled.p.attrs({
    className: 'text-ui-600 ft-text-base',
})``;
