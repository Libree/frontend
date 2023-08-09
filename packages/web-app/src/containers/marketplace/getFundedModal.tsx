import {
    IconChevronRight,
    ListItemAction,
} from '@aragon/ui-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import ModalBottomSheetSwitcher from 'components/modalBottomSheetSwitcher';
import { useGlobalModalContext } from 'context/globalModals';

const GetFundedModal: React.FC = () => {
    const { t } = useTranslation();
    const { isGetFundedOpen, close } = useGlobalModalContext();

    const handleClick = (action: string) => { };

    return (
        <ModalBottomSheetSwitcher
            isOpen={isGetFundedOpen}
            onClose={() => close('getFunded')}
            title={t('marketplace.getFunded.headerTitle')}
            subtitle={t('marketplace.getFunded.headerDescription')}
        >
            <Container>
                <ListItemAction
                    title={t('marketplace.getFunded.collateralInput')}
                    subtitle={t('marketplace.getFunded.collateralDescription')}
                    iconRight={<IconChevronRight />}
                    onClick={() => handleClick('collateralized_borrowing')}
                />
                <ListItemAction
                    title={t('marketplace.getFunded.raiseFundingInput')}
                    subtitle={t('marketplace.getFunded.raiseFundingDescription')}
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

export default GetFundedModal;
