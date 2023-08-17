import {withTransaction} from '@elastic/apm-rum-react';
import React from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components';

import {OpportunitiesSectionWrapper, PageWrapper} from 'components/wrappers';
import {useGlobalModalContext} from 'context/globalModals';
import {useDaoVault} from 'hooks/useDaoVault';
import {sortTokens} from 'utils/tokens';
import {Loading} from 'components/temporary';
import {useDaoDetailsQuery} from 'hooks/useDaoDetails';
import {IconAdd, OpportunityListItem} from '@aragon/ui-components';
import {generatePath, useNavigate, useParams} from 'react-router-dom';
import {useNetwork} from 'context/network';
import {FundOpportunity} from 'utils/paths';

const Marketplace: React.FC = () => {
  const {t} = useTranslation();
  const {data: daoDetails, isLoading} = useDaoDetailsQuery();
  const {open} = useGlobalModalContext();
  const {network} = useNetwork();
  const {dao} = useParams();
  const navigate = useNavigate();

  const {tokens} = useDaoVault();

  const opportunities: any = [
    {
      id: '1',
      title: 'Libree funding request',
      subtitle: 'Loan: 30 Days',
      tokenAmount: '10000',
      tokenSymbol: 'USDC',
      usdValue: 'Collateral: 25.50000 $LIBREE',
    },
    {
      id: '2',
      title: 'Startup investment request',
      subtitle: 'Token sale',
      tokenAmount: '10000',
      tokenSymbol: 'USDC',
      usdValue: '5000 $STARTUP',
    },
  ];

  sortTokens(tokens, 'treasurySharePercentage', true);

  /*************************************************
   *                    Render                     *
   *************************************************/
  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <PageWrapper
        title={t('marketplace.title')}
        primaryBtnProps={{
          label: t('marketplace.getFundedAction'),
          iconLeft: <IconAdd />,
          onClick: () => open('getFunded'),
        }}
        secondaryBtnProps={{
          label: t('marketplace.fundOpportunityAction'),
          iconLeft: <IconAdd />,
          onClick: () =>
            navigate(generatePath(FundOpportunity, {network, dao: dao})),
        }}
        secondaryBtnMode={'primary'}
      >
        {opportunities.length !== 0 && (
          <>
            <div className={'h-4'} />
            <OpportunitiesSectionWrapper
              title={t('marketplace.openOpportunities')}
              showButton
            >
              <ListContainer>
                <OpportunityList opportunities={opportunities.slice(0, 5)} />
              </ListContainer>
            </OpportunitiesSectionWrapper>
          </>
        )}
      </PageWrapper>
    </>
  );
};

export default withTransaction('Marketplace', 'component')(Marketplace);

const ListContainer = styled.div.attrs({
  className: 'py-2 space-y-2',
})``;

type OpportunityListProps = {
  opportunities: Array<any>;
};

const OpportunityList: React.FC<OpportunityListProps> = ({opportunities}) => {
  const {t} = useTranslation();

  if (!opportunities.length) return <p>{t('marketplace.noOpportunities')}</p>;

  return (
    <div className="space-y-2" data-testid="transferList">
      {opportunities.map(({...rest}, index) => (
        <OpportunityListItem key={`${rest.id}-${index}`} {...rest} />
      ))}
    </div>
  );
};
