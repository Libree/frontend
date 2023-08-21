import { withTransaction } from '@elastic/apm-rum-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import {
    OpportunitiesSectionWrapper,
    PageWrapper,
} from 'components/wrappers';
import { useGlobalModalContext } from 'context/globalModals';
import { useDaoVault } from 'hooks/useDaoVault';
import { sortTokens } from 'utils/tokens';
import { Loading } from 'components/temporary';
import { ButtonGroup, IconAdd, OpportunityListItem, Option } from '@aragon/ui-components';
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

    let opportunities: any = [
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
                <SelectWrapper>
                    <StyledSelect defaultValue={""}>
                        <option value="" disabled hidden>Collateralized lending</option>
                    </StyledSelect>
                </SelectWrapper>
                {loanOffers?.length ? (
                    <>
                        <LoanOfferTable loanOffers={loanOffers}/>
                    </>
                ) : (
                    <>
                        <p>{t('marketplace.noOpportunities')}</p>
                    </>
                )}
                {opportunities.length !== 0 && (
                    <>
                        <div className={'h-4'} />
                        <OpportunitiesSectionWrapper
                            title={t('marketplace.openOpportunities')}
                            showButton
                        >
                            <ListContainer>
                                <OpportunityList
                                    opportunities={opportunities.slice(0, 5)}
                                />
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

const ButtonGroupContainer = styled.div.attrs({
    className: 'flex',
})``;

const StyledSelect = styled.select.attrs({
    className: `flex items-center tablet:h-6 space-x-1.5 p-0.5 tablet:p-0.75 px-1.5 tablet:px-2
    text-ui-600 text-sm tablet:text-base
    rounded-xl border-2 border-ui-100 focus-within:ring-2 focus-within:ring-primary-500
    hover:border-ui-300 active:border-primary-500 active:ring-0`,
})``;

const SelectWrapper = styled.div.attrs({
    className: 'my-2',
})``;


/*************************************************
 *           Opportunity List component          *
 *************************************************/

type OpportunityListProps = {
    opportunities: Array<any>;
};

const OpportunityList: React.FC<OpportunityListProps> = ({
    opportunities,
}) => {
    const { t } = useTranslation();

    if (!opportunities.length)
        return <p>{t('marketplace.noOpportunities')}</p>;

    return (
        <div className="space-y-2" data-testid="transferList">
            {opportunities.map(({ ...rest }, index) => (
                <OpportunityListItem
                    key={`${rest.id}-${index}`}
                    {...rest}
                />
            ))}
        </div>
    );
};
