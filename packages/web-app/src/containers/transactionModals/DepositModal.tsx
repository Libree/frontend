import {
  AlertInline,
  ButtonText,
  IconReload,
  Spinner,
  WalletInputLegacy,
} from '@aragon/ui-components';
import React, { useCallback, useState } from 'react';
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
  [TransactionState.WAITING]: undefined,
  [TransactionState.LOADING]: <Spinner size="xs" color="white" />,
  [TransactionState.SUCCESS]: undefined,
  [TransactionState.ERROR]: <IconReload />,
};

const DepositModal: React.FC = () => {
  const { t } = useTranslation();
  const { isDepositOpen, close } = useGlobalModalContext();
  const { data: daoDetails } = useDaoDetailsQuery();
  const { network } = useNetwork();
  const { alert } = useAlertContext();
  const { deposit, tokenAllowance, approve } = useCreditDelegation(daoDetails?.address);
  const navigate = useNavigate();
  const provider = useSpecificProvider(CHAIN_METADATA[network].id);
  const [input, setInput] = useState({
    amount: '',
    tokenAddress: '',
  });

  const label = {
    [TransactionState.WAITING]: t('labels.deposit'),
    [TransactionState.LOADING]: t('TransactionModal.waiting'),
    [TransactionState.SUCCESS]: t('TransactionModal.goToFinance'),
    [TransactionState.ERROR]: t('TransactionModal.tryAgain'),
  };

  const state: any = TransactionState.WAITING;

  const copyToClipboard = (value: string | undefined) => {
    navigator.clipboard.writeText(value || '');
    alert(t('alert.chip.inputCopied'));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleCtaClicked = useCallback(async () => {
    const tokenInfo = await getTokenInfo(
      input.tokenAddress,
      provider,
      CHAIN_METADATA[network].nativeCurrency
    )
    const amount = Number(input.amount) * Math.pow(10, tokenInfo.decimals)
    const allowance = await tokenAllowance(input.tokenAddress)
    if (allowance < amount) {
      //TODO - Change modal label to approve
      approve(input.tokenAddress, amount);
    }
    deposit(input.tokenAddress, amount.toString());
  }, [close, daoDetails?.address, daoDetails?.ensDomain, navigate, network, input]);

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
      isOpen={isDepositOpen}
      onClose={() => close('deposit')}
      title={t('modal.deposit.headerTitle')}
      subtitle={t('modal.deposit.headerDescription')}
    >
      <Container>
        {toDisplayEns(daoDetails?.ensDomain) !== '' && (
          <>
            <EnsHeaderWrapper>
              <InputTitle>{t('modal.deposit.inputLabelEns')}</InputTitle>
              <InputSubtitle>{t('modal.deposit.inputHelptextEns')}</InputSubtitle>
            </EnsHeaderWrapper>
            <WalletInputLegacy
              adornmentText={t('labels.copy')}
              value={daoDetails?.ensDomain}
              onAdornmentClick={() => copyToClipboard(daoDetails?.ensDomain)}
              disabledFilled
            />
            <Divider />
          </>
        )}
        <BodyWrapper>
          <div>
            <InputTitleWrapper>
              <InputTitle>{t('modal.deposit.inputTokenAddress')}</InputTitle>
            </InputTitleWrapper>
            <StyledSelect
              name='tokenAddress'
              value={input.tokenAddress}
              onChange={handleSelectChange}
            >
              <option value="" disabled selected>{t('creditDelegation.interestRateTypePlaceholder')}</option>
              {SUPPORTED_TOKENS[SupportedNetwork.MUMBAI].map((token) => (
                <option key={token.address} value={token.address}>{token.name}</option>
              ))}
            </StyledSelect>
          </div>
          <div>
            <InputTitleWrapper>
              <InputTitle>{t('labels.amount')}</InputTitle>
            </InputTitleWrapper>
            <DepositInput
              name='amount'
              value={input.amount}
              onChange={handleInputChange}
              placeholder='100'
            />
          </div>
          <ActionWrapper>
            <ButtonsContainer>
              <ButtonText
                mode="primary"
                size="large"
                label={label[state]}
                iconLeft={icons[state]}
                onClick={handleCtaClicked}
                className='w-full'
              />
              <ButtonText
                mode="secondary"
                size="large"
                label={t('modal.deposit.cancelLabel')}
                onClick={() => close('deposit')}
                className='w-full'
              />
            </ButtonsContainer>
            {state === TransactionState.SUCCESS && (
              <AlertInlineContainer>
                <AlertInline
                  label={t('TransactionModal.successLabel')}
                  mode="success"
                />
              </AlertInlineContainer>
            )}
            {state === TransactionState.ERROR && (
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

export default DepositModal;
