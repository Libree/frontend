import { CardText } from '@aragon/ui-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { AccordionMethod } from 'components/accordionMethod';
import { ActionBudgetAllocation, SupportedNetwork } from 'utils/types';
import { SUPPORTED_TOKENS } from 'utils/config';

export const BudgetAllocationCard: React.FC<{
    action: ActionBudgetAllocation;
}> = ({ action }) => {
    const { t } = useTranslation();
    const {
        protocol,
        token,
        amount,
        group
    } = action.inputs;

    const getTokenSymbol = (tokenAddress: string) => {
        const supportedTokens = SUPPORTED_TOKENS[SupportedNetwork.MUMBAI];
        const tokenInfo = supportedTokens.find((tokenInfo) => tokenInfo.address === tokenAddress);
        return tokenInfo ? tokenInfo.name : '';
    };

    return (
        <AccordionMethod
            type="execution-widget"
            methodName={t('budgetAllocation.title')}
            smartContractName={t('labels.aragonOSx')}
            verified
            methodDescription={t('budgetAllocation.subtitle')}
        >
            <Container>
                <CardText
                    type='title'
                    title='Protocol'
                    content={protocol}
                    bgWhite
                />
                <CardText
                    type='title'
                    title='Amount'
                    content={`${amount} ${getTokenSymbol(token)}`}
                    bgWhite
                />
                <CardText
                    type='title'
                    title='Group manager'
                    content={group}
                    bgWhite
                />
            </Container>
        </AccordionMethod>
    );
};

const Container = styled.div.attrs({
    className: 'grid grid-cols-1 tablet:grid-cols-3 bg-ui-50 border border-t-0 border-ui-100 p-2',
})``;
