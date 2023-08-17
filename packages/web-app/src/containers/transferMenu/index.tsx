import {IconChevronRight, ListItemAction} from '@aragon/ui-components';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {generatePath, useNavigate, useParams} from 'react-router-dom';
import styled from 'styled-components';

import ModalBottomSheetSwitcher from 'components/modalBottomSheetSwitcher';
import {useGlobalModalContext} from 'context/globalModals';
import {useNetwork} from 'context/network';
import {useWallet} from 'hooks/useWallet';
import {trackEvent} from 'services/analytics';
import {
  BudgetAllocation,
  NewCreditDelegation,
  NewWithDraw,
  ProvideLiquidity,
  SwapTokens,
} from 'utils/paths';

type Action =
  | 'deposit_assets'
  | 'withdraw_assets'
  | 'credit_delegation'
  | 'swap_tokens'
  | 'provide_liquidity'
  | 'budget_allocation';

const TransferMenu: React.FC = () => {
  const {isTransferOpen, close, open} = useGlobalModalContext();
  const {t} = useTranslation();
  const {network} = useNetwork();
  const {dao} = useParams();
  const navigate = useNavigate();
  const {isConnected} = useWallet();

  const handleClick = (action: Action) => {
    trackEvent('newTransfer_modalBtn_clicked', {
      dao_address: dao,
      action,
    });

    if (!isConnected) {
      open('wallet');
    } else if (action === 'deposit_assets') {
      open('deposit');
    } else if (action === 'credit_delegation') {
      navigate(generatePath(NewCreditDelegation, {network: network, dao: dao}));
    } else if (action === 'swap_tokens') {
      navigate(generatePath(SwapTokens, {network: network, dao: dao}));
    } else if (action === 'provide_liquidity') {
      navigate(generatePath(ProvideLiquidity, {network: network, dao: dao}));
    } else if (action === 'budget_allocation') {
      navigate(generatePath(BudgetAllocation, {network: network, dao: dao}));
    } else {
      navigate(generatePath(NewWithDraw, {network: network, dao: dao}));
    }
    close('default');
  };

  return (
    <ModalBottomSheetSwitcher
      isOpen={isTransferOpen}
      onClose={() => close('default')}
      title={t('TransferModal.newTransfer')}
    >
      <Container>
        <ListItemAction
          title={t('modal.deposit.headerTitle')}
          subtitle={t('modal.deposit.headerDescription')}
          iconRight={<IconChevronRight />}
          onClick={() => handleClick('deposit_assets')}
        />
        <ListItemAction
          title={t('TransferModal.item2Title')}
          subtitle={t('TransferModal.item2Subtitle')}
          iconRight={<IconChevronRight />}
          onClick={() => handleClick('withdraw_assets')}
        />
        <ListItemAction
          title={t('TransferModal.creditDelegation')}
          subtitle={t('TransferModal.creditSubtitle')}
          iconRight={<IconChevronRight />}
          onClick={() => handleClick('credit_delegation')}
        />
        <ListItemAction
          title={t('TransferModal.swapTokens')}
          subtitle={t('TransferModal.swapSubtitle')}
          iconRight={<IconChevronRight />}
          onClick={() => handleClick('swap_tokens')}
        />
        <ListItemAction
          title={t('TransferModal.provideLiquidity')}
          subtitle={t('TransferModal.provideSubtitle')}
          iconRight={<IconChevronRight />}
          onClick={() => handleClick('provide_liquidity')}
        />
        <ListItemAction
          title={t('TransferModal.budgetAllocation')}
          subtitle={t('TransferModal.budgetSubtitle')}
          iconRight={<IconChevronRight />}
          onClick={() => handleClick('budget_allocation')}
        />
      </Container>
    </ModalBottomSheetSwitcher>
  );
};

export default TransferMenu;

const Container = styled.div.attrs({
  className: 'space-y-1.5 p-3',
})``;
