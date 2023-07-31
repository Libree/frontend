import { CardText, IconLinkExternal, IconPerson } from '@aragon/ui-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { AccordionMethod } from 'components/accordionMethod';
import { useNetwork } from 'context/network';
import { CHAIN_METADATA } from 'utils/constants';
import { ActionCreditDelegation } from 'utils/types';
import { capitalizeFirstLetter } from 'utils';
import { shortenAddress } from '@aragon/ui-components';
import { getTokenSymbol } from 'utils/library';

export const CreditDelegationCard: React.FC<{
    action: ActionCreditDelegation;
}> = ({ action }) => {
    const { t } = useTranslation();
    const { network } = useNetwork();
    const { user, amount, token, interestRateType } = action.inputs;

    return (
        <AccordionMethod
            type="execution-widget"
            methodName={t('TransferModal.creditDelegation')}
            smartContractName={t('labels.aragonOSx')}
            verified
            methodDescription={t('TransferModal.creditSubtitle')}
        >
            <Container>
                <StyledCard
                    onClick={() => {
                        window.open(
                            `${CHAIN_METADATA[network].explorer}address/${user}`,
                            '_blank'
                        )
                    }}
                >
                    <LeftContent>
                        <IconPerson className="w-2.5 h-2.5" />
                        <p className="font-bold">{shortenAddress(user)}</p>
                    </LeftContent>

                    <RightContent>
                        <p className="text-ui-500">
                            {amount} {getTokenSymbol(token)}
                        </p>
                        <IconLinkExternal />
                    </RightContent>
                </StyledCard>
                <CardText
                    type='title'
                    title={t('creditDelegation.interestRateType')}
                    content={capitalizeFirstLetter(interestRateType)}
                />
            </Container>
        </AccordionMethod>
    );
};

const Container = styled.div.attrs({
    className: 'bg-ui-50 border border-t-0 border-ui-100 space-y-1 p-2',
})``;

const StyledCard = styled.button.attrs(() => {
    const baseLayoutClasses =
        'flex items-center justify-between w-full border-2 border-transparent ';
    const baseStyleClasses = 'bg-ui-0 p-2 tablet:p-3 rounded-xl';
    let className:
        | string
        | undefined = `${baseLayoutClasses} ${baseStyleClasses}`;

    const focusVisibleClasses =
        'focus-visible:ring-0 focus-visible:ring-transparent';
    const hoverClasses = 'hover:text-primary-500 hover:shadow-100';
    const activeClasses = 'active:outline-none active:border-ui-200';

    className += ` text-ui-600 ${focusVisibleClasses} ${activeClasses} ${hoverClasses}`;

    return { className };
})``;

const LeftContent = styled.div.attrs({ className: 'flex space-x-2' })``;
const RightContent = styled.div.attrs({
    className: 'flex space-x-2 items-center ft-text-sm',
})``;
