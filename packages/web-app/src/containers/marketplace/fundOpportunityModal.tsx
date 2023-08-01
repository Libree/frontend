import {
    AlertInline,
    ButtonText,
    IconReload,
    Spinner,
    WalletInputLegacy,
} from '@aragon/ui-components';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import ModalBottomSheetSwitcher from 'components/modalBottomSheetSwitcher';
import { useAlertContext } from 'context/alert';
import { useGlobalModalContext } from 'context/globalModals';
import { useNetwork } from 'context/network';
import { useDaoDetailsQuery } from 'hooks/useDaoDetails';
import { toDisplayEns } from 'utils/library';
import { useCreditDelegation } from 'hooks/useCreditDelegation';
import { getTokenInfo } from 'utils/tokens';
import { CHAIN_METADATA, TransactionState } from 'utils/constants';
import { useSpecificProvider } from 'context/providers';
import { SUPPORTED_TOKENS } from 'utils/config';
import { SupportedNetwork } from 'utils/types';

const icons = {
    [TransactionState.APPROVING]: undefined,
    [TransactionState.WAITING]: undefined,
    [TransactionState.LOADING]: <Spinner size="xs" color="white" />,
    [TransactionState.SUCCESS]: undefined,
    [TransactionState.ERROR]: <IconReload />,
};

const FundOpportunity: React.FC = () => {
    const { t } = useTranslation();
    const { isFundOpportunityOpen, close } = useGlobalModalContext();
    const { data: daoDetails } = useDaoDetailsQuery();
    const { network } = useNetwork();
    const { alert } = useAlertContext();
    const { deposit, tokenAllowance, approve } = useCreditDelegation(daoDetails?.address);
    const navigate = useNavigate();
    const provider = useSpecificProvider(CHAIN_METADATA[network].id);
    const [input, setInput] = useState({
        collateralizedBorrowing: '',
        raiseFunding: '',
    });
    const [depositProcessState, setDepositProcessState] =
        useState<TransactionState>(TransactionState.WAITING);

    const label = {
        [TransactionState.APPROVING]: t('TransactionModal.publishDaoButtonLabel'),
        [TransactionState.WAITING]: t('labels.deposit'),
        [TransactionState.LOADING]: t('TransactionModal.waiting'),
        [TransactionState.SUCCESS]: t('TransactionModal.goToFinance'),
        [TransactionState.ERROR]: t('TransactionModal.tryAgain'),
    };

    useEffect(() => setDepositProcessState(TransactionState.WAITING), [isFundOpportunityOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const handleCtaClicked = useCallback(async () => {
        try {
            console.log('input', input);
        } catch {
            setDepositProcessState(TransactionState.ERROR);
        }
    }, [close, daoDetails?.address, daoDetails?.ensDomain, navigate, network, input]);

    const handleOnClick = () => {
        if (!depositProcessState || depositProcessState === TransactionState.WAITING) {
            handleCtaClicked();
            return;
        }
        if (depositProcessState === TransactionState.SUCCESS) {
            close('deposit');
            window.location.reload();
            return;
        }
    }

    const Divider: React.FC = () => {
        return (
            <DividerWrapper>
                <hr className="w-full h-px bg-ui-200" />
                <span className="px-1 font-semibold text-ui-400">
                    {t('modal.deposit.dividerLabel')}
                </span>
                <hr className="w-full h-px bg-ui-200" />
            </DividerWrapper>
        );
    };

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
                        </InputTitleWrapper>
                        <StyledSelect
                            name='collateralizedBorrowing'
                            value={input.collateralizedBorrowing}
                            onChange={handleSelectChange}
                        >
                            <option value="" disabled selected>{t('creditDelegation.selectAnOption')}</option>
                            {SUPPORTED_TOKENS[SupportedNetwork.MUMBAI].map((token) => (
                                <option key={token.address} value={token.address}>{token.name}</option>
                            ))}
                        </StyledSelect>
                    </div>
                    <div>
                        <InputTitleWrapper>
                            <InputTitle>{t('marketplace.fundOpportunity.raiseFundingInput')}</InputTitle>
                        </InputTitleWrapper>
                        <DepositInput
                            name='raiseFunding'
                            value={input.raiseFunding}
                            onChange={handleInputChange}
                            placeholder='100'
                        />
                    </div>
                    <ActionWrapper>
                        <ButtonsContainer>
                            <ButtonText
                                mode="primary"
                                size="large"
                                label={label[depositProcessState]}
                                iconLeft={icons[depositProcessState]}
                                onClick={handleOnClick}
                                className='w-full'
                            />
                            {(!depositProcessState || depositProcessState === TransactionState.WAITING) && (
                                <ButtonText
                                    mode="secondary"
                                    size="large"
                                    label={t('modal.deposit.cancelLabel')}
                                    onClick={() => close('deposit')}
                                    className='w-full'
                                />
                            )}
                        </ButtonsContainer>
                        {depositProcessState === TransactionState.SUCCESS && (
                            <AlertInlineContainer>
                                <AlertInline
                                    label={t('TransactionModal.successLabel')}
                                    mode="success"
                                />
                            </AlertInlineContainer>
                        )}
                        {depositProcessState === TransactionState.ERROR && (
                            <AlertInlineContainer>
                                <AlertInline
                                    label={t('TransactionModal.errorLabel')}
                                    mode="critical"
                                />
                            </AlertInlineContainer>
                        )}
                    </ActionWrapper>
                </BodyWrapper>
            </Container>
        </ModalBottomSheetSwitcher>
    );
};

const Container = styled.div.attrs({
    className: 'p-3',
})``;

const EnsHeaderWrapper = styled.div.attrs({
    className: 'space-y-0.5 mb-1.5',
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

const AlertInlineContainer = styled.div.attrs({
    className: 'mx-auto mt-2 w-max',
})``;

const ButtonsContainer = styled.div.attrs({
    className: 'flex space-x-1.5 justify-center',
})``;

const ActionWrapper = styled.div.attrs({
    className: '',
})``;

const DividerWrapper = styled.div.attrs({
    className: 'flex items-center my-1',
})``;

const DepositInput = styled(WalletInputLegacy).attrs({
    className: 'text-right px-2',
})``;

const StyledSelect = styled.select.attrs({
    className: `w-full flex items-center h-6 space-x-1.5 p-0.75 pl-2 text-ui-600 
    rounded-xl border-2 border-ui-100 focus-within:ring-2 focus-within:ring-primary-500
    hover:border-ui-300 active:border-primary-500 active:ring-0`,
})``;

export default FundOpportunity;
