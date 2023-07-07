import { CardText, ListItemAddress } from '@aragon/ui-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { AccordionMethod } from 'components/accordionMethod';
import { useNetwork } from 'context/network';
import { CHAIN_METADATA } from 'utils/constants';
import { ActionCreditDelegation } from 'utils/types';

export const CreditDelegationCard: React.FC<{
    action: ActionCreditDelegation;
}> = ({ action }) => {
    const { t } = useTranslation();
    const { network } = useNetwork();
    const { user, amount, interestRateType } = action.inputs;

    return (
        <AccordionMethod
            type="execution-widget"
            methodName={t('TransferModal.creditDelegation')}
            smartContractName={t('labels.aragonOSx')}
            verified
            methodDescription={t('TransferModal.creditSubtitle')}
        >
            <Container>
                <ListItemAddress
                    label={user}
                    src={null}
                    key={user}
                    tokenInfo={{
                        amount: amount,
                        symbol: '',
                        percentage: '0',
                    }}
                    onClick={() =>
                        window.open(
                            `${CHAIN_METADATA[network].explorer}address/${user}`,
                            '_blank'
                        )
                    }
                />
                <CardText
                    type='title'
                    title={t('creditDelegation.interestRateType')}
                    content={interestRateType}
                />
            </Container>
        </AccordionMethod>
    );
};

const Container = styled.div.attrs({
    className: 'bg-ui-50 border border-t-0 border-ui-100 space-y-1 p-2',
})``;
