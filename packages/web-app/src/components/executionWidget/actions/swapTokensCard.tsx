import { CardSwap } from '@aragon/ui-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { AccordionMethod } from 'components/accordionMethod';
import { ActionSwapTokens } from 'utils/types';
import { getTokenSymbol } from 'utils/library';

export const SwapTokensCard: React.FC<{
    action: ActionSwapTokens;
}> = ({ action }) => {
    const { t } = useTranslation();
    const { amount, tokenInput, tokenOutput } = action.inputs;

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
