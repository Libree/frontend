import {
    IconChevronRight,
    ListItemAction,
} from '@aragon/ui-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import ModalBottomSheetSwitcher from 'components/modalBottomSheetSwitcher';
import { useGlobalModalContext } from 'context/globalModals';

const FundOpportunityModal: React.FC = () => {
    const { t } = useTranslation();
    const { isFundOpportunityOpen, close } = useGlobalModalContext();

    const handleClick = (action: string) => {};

    return (
        <ModalBottomSheetSwitcher
            isOpen={isFundOpportunityOpen}
            onClose={() => close('fundOpportunity')}
            title={t('marketplace.fundOpportunity.headerTitle')}
            subtitle={t('marketplace.fundOpportunity.headerDescription')}
        >
            <Container>
                <ListItemAction
                    title={t('marketplace.fundOpportunity.collateralInput')}
                    subtitle={t('marketplace.fundOpportunity.collateralDescription')}
                    iconRight={<IconChevronRight />}
                    onClick={() => handleClick('collateralized_borrowing')}
                />
                <ListItemAction
                    title={t('marketplace.fundOpportunity.raiseFundingInput')}
                    subtitle={t('marketplace.fundOpportunity.raiseFundingDescription')}
                    iconRight={<IconChevronRight />}
                    onClick={() => handleClick('raise_funding')}
                />
            </Container>
        </ModalBottomSheetSwitcher>
    );
};

const Container = styled.div.attrs({
    className: 'space-y-1.5 p-3',
})``;

export default FundOpportunityModal;
