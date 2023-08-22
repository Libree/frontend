import { CardText } from '@aragon/ui-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { AccordionMethod } from 'components/accordionMethod';
import { ActionFundOpportunity } from 'utils/types';
import { getTokenSymbol } from 'utils/library';

export const FundOpportunityCard: React.FC<{
    action: ActionFundOpportunity;
}> = ({ action }) => {
    const { t } = useTranslation();
    const {
        fundingSource,
        collateralType,
        collateralAddress,
        collateralAmount,
        collateralId,
        principalAsset,
        loanAmount,
        loanYield,
        durationTime,
        expirationTime,
        borrower,
        isPersistent,
        interestRateType,
    } = action.inputs;

    return (
        <AccordionMethod
            type="execution-widget"
            methodName={t('marketplace.fundOpportunity.headerTitle')}
            smartContractName={t('labels.aragonOSx')}
            verified
        >
            <Container>
                <CardText
                    type='title'
                    title={t('marketplace.fundOpportunity.fundingSource')}
                    content={fundingSource}
                />
                <CardText
                    type='title'
                    title={t('marketplace.fundOpportunity.collateralType')}
                    content={collateralType}
                />
                {collateralAddress && (
                    <CardText
                        type='title'
                        title={t('marketplace.fundOpportunity.collateralAddress')}
                        content={getTokenSymbol(collateralAddress)}
                    />
                )}
                {collateralAmount && (
                    <CardText
                        type='title'
                        title={t('marketplace.fundOpportunity.collateralAmount')}
                        content={collateralAmount as unknown as string}
                    />
                )}
                {collateralId && (
                    <CardText
                        type='title'
                        title={t('marketplace.fundOpportunity.collateralId')}
                        content={collateralId as unknown as string}
                    />
                )}
                <CardText
                    type='title'
                    title={t('marketplace.fundOpportunity.principalAsset')}
                    content={principalAsset}
                />
                <CardText
                    type='title'
                    title={t('marketplace.fundOpportunity.loanAmount')}
                    content={loanAmount as unknown as string}
                />
                <CardText
                    type='title'
                    title={t('marketplace.fundOpportunity.loanYield')}
                    content={loanYield as unknown as string}
                />
                <CardText
                    type='title'
                    title={t('marketplace.fundOpportunity.durationTime')}
                    content={durationTime as unknown as string}
                />
                <CardText
                    type='title'
                    title={t('marketplace.fundOpportunity.expirationTime')}
                    content={expirationTime as unknown as string}
                />
                <CardText
                    type='title'
                    title={t('marketplace.fundOpportunity.borrower')}
                    content={borrower}
                />
                <CardText
                    type='title'
                    title={t('marketplace.fundOpportunity.isPersistent')}
                    content={isPersistent}
                />
                {interestRateType && (
                    <CardText
                        type='title'
                        title={t('marketplace.fundOpportunity.interestRateType')}
                        content={interestRateType as string}
                    />
                )}
            </Container>
        </AccordionMethod>
    );
};

const Container = styled.div.attrs({
    className: 'bg-ui-50 border border-t-0 border-ui-100 space-y-1 p-2 grid grid-cols-6',
})``;
