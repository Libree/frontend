import {CardText} from '@aragon/ui-components';
import React from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components';

import {AccordionMethod} from 'components/accordionMethod';
import {ActionLoanOffer} from 'utils/types';
import {getTokenSymbol} from 'utils/library';

export const LoanOfferCard: React.FC<{
  action: ActionLoanOffer;
}> = ({action}) => {
  const {t} = useTranslation();
  const {
    fundingSource,
    collateralType,
    collateralAddress,
    collateralAmount,
    principalAsset,
    loanAmount,
    loanYield,
    durationTime,
  } = action.inputs;

  return (
    <AccordionMethod
      type="execution-widget"
      methodName={t('loanOffer.title')}
      smartContractName={t('labels.aragonOSx')}
      verified
    >
      <Container>
        {collateralAddress && (
          <CardText
            type="title"
            title={t('marketplace.fundOpportunity.collateralAddress')}
            content={getTokenSymbol(collateralAddress)}
          />
        )}
        {collateralAmount && (
          <CardText
            type="title"
            title={t('marketplace.fundOpportunity.collateralAmount')}
            content={collateralAmount as unknown as string}
          />
        )}
        <CardText
          type="title"
          title={t('marketplace.fundOpportunity.principalAsset')}
          content={getTokenSymbol(principalAsset)}
        />
        <CardText
          type="title"
          title={t('marketplace.fundOpportunity.loanAmount')}
          content={loanAmount as unknown as string}
        />
        <CardText
          type="title"
          title={t('marketplace.fundOpportunity.loanYield')}
          content={loanYield as unknown as string}
        />
        <CardText
          type="title"
          title={t('marketplace.fundOpportunity.durationTime')}
          content={durationTime as unknown as string}
        />
      </Container>
    </AccordionMethod>
  );
};

const Container = styled.div.attrs({
  className: 'bg-ui-50 border border-t-0 border-ui-100 space-y-1 p-2',
})``;
