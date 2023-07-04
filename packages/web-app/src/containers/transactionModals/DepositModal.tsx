import {
  ButtonText,
  WalletInputLegacy,
  shortenAddress,
} from '@aragon/ui-components';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import ModalBottomSheetSwitcher from 'components/modalBottomSheetSwitcher';
import { useAlertContext } from 'context/alert';
import { useGlobalModalContext } from 'context/globalModals';
import { useNetwork } from 'context/network';
import { useDaoDetailsQuery } from 'hooks/useDaoDetails';
import { toDisplayEns } from 'utils/library';
import { AllTransfers } from 'utils/paths';

const DepositModal: React.FC = () => {
  const { t } = useTranslation();
  const { isDepositOpen, close } = useGlobalModalContext();
  const { data: daoDetails } = useDaoDetailsQuery();
  const { network } = useNetwork();
  const { alert } = useAlertContext();
  const navigate = useNavigate();
  const [input, setInput] = useState({
    amount: '100',
    tokenAddress: '',
  });

  useEffect(() => {
    daoDetails?.address && setInput({ ...input, tokenAddress: daoDetails?.address as string });
  }, [daoDetails?.address]);

  const copyToClipboard = (value: string | undefined) => {
    navigator.clipboard.writeText(value || '');
    alert(t('alert.chip.inputCopied'));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleCtaClicked = useCallback(() => {
    close('deposit');
    navigate(
      generatePath(AllTransfers, {
        network,
        dao: toDisplayEns(daoDetails?.ensDomain) || daoDetails?.address,
      })
    );
  }, [close, daoDetails?.address, daoDetails?.ensDomain, navigate, network]);

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
            <DepositInput
              name='tokenAddress'
              value={shortenAddress(input.tokenAddress)}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <InputTitleWrapper>
              <InputTitle>{t('labels.amount')}</InputTitle>
            </InputTitleWrapper>
            <DepositInput
              name='amount'
              value={input.amount}
              onChange={handleInputChange}
            />
          </div>
          <ActionWrapper>
            <ButtonText
              mode="primary"
              size="large"
              label={t('labels.deposit')}
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

const ActionWrapper = styled.div.attrs({
  className: 'flex space-x-1.5 justify-center',
})``;

const DividerWrapper = styled.div.attrs({
  className: 'flex items-center my-1',
})``;

const DepositInput = styled(WalletInputLegacy).attrs({
  className: 'text-right px-2',
})``;

export default DepositModal;
