import { CardSwap } from '@aragon/ui-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { AccordionMethod } from 'components/accordionMethod';
import { ActionSwapTokens, SupportedNetwork } from 'utils/types';
import { SUPPORTED_TOKENS } from 'utils/config';

export const SwapTokensCard: React.FC<{
    action: ActionSwapTokens;
}> = ({ action }) => {
    const { t } = useTranslation();
    const { amount, tokenInput, tokenOutput } = action.inputs;

    const getTokenSymbol = (tokenAddress: string) => {
        const supportedTokens = SUPPORTED_TOKENS[SupportedNetwork.MUMBAI];
        const tokenInfo = supportedTokens.find((tokenInfo) => tokenInfo.address === tokenAddress);
        return tokenInfo ? tokenInfo.name : '';
    };

    return (
        <AccordionMethod
            type="execution-widget"
            methodName={t('swapTokens.title')}
            smartContractName={t('labels.aragonOSx')}
            verified
            methodDescription={t('swapTokens.subtitle')}
        >
            <Container>
                <CardSwap
                    toSymbol={getTokenSymbol(tokenOutput)}
                    fromSymbol={getTokenSymbol(tokenInput)}
                    amount={amount}
                    toLabel='To'
                    fromLabel='From'
                    bgWhite
                />
            </Container>
        </AccordionMethod>
    );
};

const Container = styled.div.attrs({
    className: 'bg-ui-50 border border-t-0 border-ui-100 space-y-1 p-2',
})``;
