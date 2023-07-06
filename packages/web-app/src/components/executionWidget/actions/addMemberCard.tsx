import { ListItemAction, ListItemAddress } from '@aragon/ui-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { AccordionMethod } from 'components/accordionMethod';
import AccordionSummary from 'containers/actionBuilder/addAddresses/accordionSummary';
import { useNetwork } from 'context/network';
import { CHAIN_METADATA } from 'utils/constants';
import { ActionAddMember } from 'utils/types';

export const AddMemberCard: React.FC<{
    action: ActionAddMember;
}> = ({ action }) => {
    const { t } = useTranslation();
    const { network } = useNetwork();
    const memberWallets = action.addresses;

    return (
        <AccordionMethod
            type="execution-widget"
            methodName={t('labels.addMembers')}
            smartContractName={t('labels.aragonOSx')}
            verified
            methodDescription={t('labels.addWalletsDescription')}
        >
            <GroupNameContainer>
                <ListItemAction title={action.groupName} />
            </GroupNameContainer>
            <Container>
                {memberWallets.map((address) => (
                    <ListItemAddress
                        label={address}
                        src={address}
                        key={address}
                        onClick={() =>
                            window.open(
                                `${CHAIN_METADATA[network].explorer}address/${address}`,
                                '_blank'
                            )
                        }
                    />
                ))}
            </Container>
            <AccordionSummary
                type="execution-widget"
                total={memberWallets.length}
            />
        </AccordionMethod>
    );
};

const GroupNameContainer = styled.div.attrs({
    className: 'bg-ui-50 border border-t-0 border-ui-100 space-y-1 p-2 mb-1',
})``;

const Container = styled.div.attrs({
    className: 'bg-ui-50 border border-ui-100 space-y-1 p-2',
})``;
