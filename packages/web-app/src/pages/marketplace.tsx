import { withTransaction } from '@elastic/apm-rum-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { PageWrapper } from 'components/wrappers';
import { useGlobalModalContext } from 'context/globalModals';
import { useDaoVault } from 'hooks/useDaoVault';
import { sortTokens } from 'utils/tokens';
import { Loading } from 'components/temporary';
import { ButtonGroup, IconAdd, Option } from '@aragon/ui-components';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useNetwork } from 'context/network';
import { FundOpportunity } from 'utils/paths';
import { LoanOfferTable } from 'components/loanOfferTable';
import { useLoanOffers } from 'hooks/useLoanOffers';
import { MarketplaceFilter } from 'utils/types';

const Marketplace: React.FC = () => {
    const { t } = useTranslation();
    const { open } = useGlobalModalContext();
    const { network } = useNetwork();
    const { dao } = useParams();
    const navigate = useNavigate();

    const [filterValue, setFilterValue] = useState<MarketplaceFilter>('lending')

    const { tokens } = useDaoVault();
    const { data: loanOffers, isLoading } = useLoanOffers();

    sortTokens(tokens, 'treasurySharePercentage', true);

    /*************************************************
     *                   Handlers                    *
     *************************************************/
    const handleFilterChange = (filterValue: string) => {
        setFilterValue(filterValue as unknown as MarketplaceFilter);
    };


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
                    onClick: () => navigate(generatePath(FundOpportunity, { network, dao: dao })),
                }}
            >
                <Title>{t('marketplace.openOpportunities')}</Title>
                <FiltersContainer>
                    <SelectWrapper>
                        <StyledSelect defaultValue={""}>
                            <option value="" disabled hidden>Collateralized lending</option>
                        </StyledSelect>
                    </SelectWrapper>
                    <ButtonGroupContainer>
                        <ButtonGroup
                            defaultValue={filterValue}
                            onChange={handleFilterChange}
                            bgWhite={false}
                        >
                            <Option label={t('marketplace.filter.lending')} value="lending" />
                            <Option label={t('marketplace.filter.borrowing')} value="borrowing" />
                        </ButtonGroup>
                    </ButtonGroupContainer>
                </FiltersContainer>
                {loanOffers?.length ? (
                    <>
                        <LoanOfferTable loanOffers={loanOffers} />
                    </>
                ) : (
                    <>
                        <p>{t('marketplace.noOpportunities')}</p>
                    </>
                )}
            </PageWrapper>
        </>
    );
};

export default withTransaction('Marketplace', 'component')(Marketplace);

const Title = styled.p.attrs({
    className: 'flex text-lg font-bold items-center text-ui-800',
})``;

const ButtonGroupContainer = styled.div.attrs({
    className: 'flex',
})``;

const FiltersContainer = styled.div.attrs({
    className: 'flex flex-col tablet:flex-row tablet:items-center justify-start tablet:justify-between',
})``;

const StyledSelect = styled.select.attrs({
    className: `flex items-center space-x-1.5 p-0.5 tablet:p-0.75 px-1.5 tablet:px-2
    text-ui-600 text-sm tablet:text-base
    rounded-xl border-2 border-ui-100 focus-within:ring-2 focus-within:ring-primary-500
    hover:border-ui-300 active:border-primary-500 active:ring-0`,
})``;

const SelectWrapper = styled.div.attrs({
    className: 'my-2',
})``;
