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
                <div className='col-span-6 flex'>
                    <CardText
                        type='title'
                        title={t('marketplace.fundOpportunity.fundingSource')}
                        content={fundingSource}
                        bgWhite
                    />
                    <CardText
                        type='title'
                        title={t('marketplace.fundOpportunity.collateralType')}
                        content={collateralType}
                        bgWhite
                    />
                </div>
                <div className='col-span-3 tablet:col-span-2'>
                    <CardText
                        type='label'
                        title={t('marketplace.fundOpportunity.collateralAddress')}
                        content={getTokenSymbol(collateralAddress)}
                        bgWhite
                    />
                </div>
                <div className='col-span-3 tablet:col-span-2'>
                    {collateralAmount && (
                        <CardText
                            type='label'
                            title={t('marketplace.fundOpportunity.collateralAmount')}
                            content={collateralAmount as unknown as string}
                            bgWhite
                        />
                    )}
                    {collateralId && (
                        <CardText
                            type='label'
                            title={t('marketplace.fundOpportunity.collateralId')}
                            content={collateralId as unknown as string}
                            bgWhite
                        />
                    )}
                </div>
                <div className='col-span-3 tablet:col-span-2'>
                    <CardText
                        type='label'
                        title={t('marketplace.fundOpportunity.principalAsset')}
                        content={principalAsset}
                        bgWhite
                    />
                </div>
                <div className='col-span-3'>
                    <CardText
                        type='label'
                        title={t('marketplace.fundOpportunity.loanAmount')}
                        content={loanAmount as unknown as string}
                        bgWhite
                    />
                </div>
                <div className='col-span-3'>
                    <CardText
                        type='label'
                        title={t('marketplace.fundOpportunity.loanYield')}
                        content={loanYield as unknown as string}
                        bgWhite
                    />
                </div>
                <div className='col-span-3'>
                    <CardText
                        type='label'
                        title={t('marketplace.fundOpportunity.durationTime')}
                        content={durationTime as unknown as string}
                        bgWhite
                    />
                </div>
                <div className='col-span-3'>
                    <CardText
                        type='label'
                        title={t('marketplace.fundOpportunity.expirationTime')}
                        content={expirationTime as unknown as string}
                        bgWhite
                    />
                </div>
                <div className='col-span-6'>
                    <CardText
                        type='label'
                        title={t('marketplace.fundOpportunity.borrower')}
                        content={borrower}
                        bgWhite
                    />
                </div>
                <div className='col-span-3'>
                    <CardText
                        type='label'
                        title={t('marketplace.fundOpportunity.isPersistent')}
                        content={isPersistent}
                        bgWhite
                    />
                </div>
                <div className='col-span-3'>
                    {interestRateType && (
                        <CardText
                            type='label'
                            title={t('marketplace.fundOpportunity.interestRateType')}
                            content={interestRateType as string}
                            bgWhite
                        />
                    )}
                </div>
            </Container>
        </AccordionMethod>
    );
};

const Container = styled.div.attrs({
    className: 'bg-ui-50 border border-t-0 border-ui-100 space-y-1 p-2 grid grid-cols-6',
})``;
