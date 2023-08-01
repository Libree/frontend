import {
    ButtonText,
    WalletInputLegacy,
} from '@aragon/ui-components';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import ModalBottomSheetSwitcher from 'components/modalBottomSheetSwitcher';
import { useGlobalModalContext } from 'context/globalModals';

const FundOpportunityModal: React.FC = () => {
    const { t } = useTranslation();
    const { isFundOpportunityOpen, close } = useGlobalModalContext();
    const [input, setInput] = useState({
        collateralizedBorrowing: '',
        raiseFunding: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const handleCtaClicked = useCallback(async () => {
        console.log('input', input);
    }, [close, input]);

    return (
        <ModalBottomSheetSwitcher
            isOpen={isFundOpportunityOpen}
            onClose={() => close('fundOpportunity')}
            title={t('marketplace.fundOpportunity.headerTitle')}
            subtitle={t('marketplace.fundOpportunity.headerDescription')}
        >
            <Container>
                <BodyWrapper>
                    <div>
                        <InputTitleWrapper>
                            <InputTitle>{t('marketplace.fundOpportunity.collateralInput')}</InputTitle>
                            <InputSubtitle>{t('marketplace.fundOpportunity.collateralDescription')}</InputSubtitle>
                        </InputTitleWrapper>
                        <DepositInput
                            name='raiseFunding'
                            value={input.raiseFunding}
                            onChange={handleInputChange}
                            placeholder='...'
                        />
                    </div>
                    <div>
                        <InputTitleWrapper>
                            <InputTitle>{t('marketplace.fundOpportunity.raiseFundingInput')}</InputTitle>
                            <InputSubtitle>{t('marketplace.fundOpportunity.raiseFundingDescription')}</InputSubtitle>
                        </InputTitleWrapper>
                        <DepositInput
                            name='raiseFunding'
                            value={input.raiseFunding}
                            onChange={handleInputChange}
                            placeholder='...'
                        />
                    </div>
                    <ActionWrapper>
                        <ButtonsContainer>
                            <ButtonText
                                mode="primary"
                                size="large"
                                label={t('marketplace.fundOpportunity.confirmLabel')}
                                onClick={handleCtaClicked}
                                className='w-full'
                            />
                            <ButtonText
                                mode="secondary"
                                size="large"
                                label={t('modal.deposit.cancelLabel')}
                                onClick={() => close('fundOpportunity')}
                                className='w-full'
                            />
                        </ButtonsContainer>
                    </ActionWrapper>
                </BodyWrapper>
            </Container>
        </ModalBottomSheetSwitcher>
    );
};

const Container = styled.div.attrs({
    className: 'p-3',
})``;

const InputTitle = styled.h2.attrs({
    className: 'ft-text-base text-ui-800',
})``;

const InputSubtitle = styled.p.attrs({
    className: 'text-ui-600 ft-text-sm',
})``;

const InputTitleWrapper = styled.div.attrs({
    className: 'mb-1',
})``;

const BodyWrapper = styled.div.attrs({
    className: 'space-y-3',
})``;

const ButtonsContainer = styled.div.attrs({
    className: 'flex space-x-1.5 justify-center',
})``;

const ActionWrapper = styled.div.attrs({
    className: '',
})``;

const DepositInput = styled(WalletInputLegacy).attrs({
    className: 'text-right px-2',
})``;

export default FundOpportunityModal;
