import { CardText } from '@aragon/ui-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { AccordionMethod } from 'components/accordionMethod';
import { ActionProvideLiquidity, SupportedNetwork } from 'utils/types';
import { SUPPORTED_TOKENS } from 'utils/config';

export const ProvideLiquidityCard: React.FC<{
    action: ActionProvideLiquidity;
}> = ({ action }) => {
    const { t } = useTranslation();
    const {
        token0,
        token0Amount,
        token1,
        token1Amount,
        feeTier,
        minPrice,
        maxPrice,
    } = action.inputs;

    const getTokenSymbol = (tokenAddress: string) => {
        const supportedTokens = SUPPORTED_TOKENS[SupportedNetwork.MUMBAI];
        const tokenInfo = supportedTokens.find((tokenInfo) => tokenInfo.address === tokenAddress);
        return tokenInfo ? tokenInfo.name : '';
    };

    return (
        <AccordionMethod
            type="execution-widget"
            methodName={t('provideLiquidity.title')}
            smartContractName={t('labels.aragonOSx')}
            verified
            methodDescription={t('provideLiquidity.subtitle')}
        >
            <Container>
                <div className='flex flex-col tablet:flex-row w-full'>
                    <CardText
                        type='label'
                        title='Token One'
                        content={`${token0Amount} ${getTokenSymbol(token0)}`}
                        bgWhite
                    />
                    <CardText
                        type='label'
                        title='Token Two'
                        content={`${token1Amount} ${getTokenSymbol(token1)}`}
                        bgWhite
                    />
                    <CardText
                        type='label'
                        title='Fee tier'
                        content={`${feeTier}%`}
                        bgWhite
                    />
                </div>
                <div className='flex flex-col tablet:flex-row w-full'>
                    <CardText
                        type='label'
                        title='Min price'
                        content={minPrice}
                        bgWhite
                    />
                    <CardText
                        type='label'
                        title='Max price'
                        content={maxPrice}
                        bgWhite
                    />
                </div>
            </Container>
        </AccordionMethod>
    );
};

const Container = styled.div.attrs({
    className: 'bg-ui-50 border border-t-0 border-ui-100 space-y-1 p-2',
})``;
