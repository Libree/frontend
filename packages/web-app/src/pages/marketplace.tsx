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
import { useDaoDetailsQuery } from 'hooks/useDaoDetails';
import { ButtonGroup, IconAdd, OpportunityListItem, Option } from '@aragon/ui-components';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useNetwork } from 'context/network';
import { FundOpportunity } from 'utils/paths';
import { LoanOfferTable } from 'components/loanOfferTable';

// TODO: move this to the corresponding type file
type MarketplaceFilter = 'lending' | 'borrowing';

const Marketplace: React.FC = () => {
    const { t } = useTranslation();
    const { data: daoDetails, isLoading } = useDaoDetailsQuery();
    const { open } = useGlobalModalContext();
    const { network } = useNetwork();
    const { dao } = useParams();
    const navigate = useNavigate();

    const [filterValue, setFilterValue] = useState<MarketplaceFilter>('lending')

    const { tokens } = useDaoVault();

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

    const loanOffers = [
        {
            id: 2,
            collateralCategory: 0,
            collateralAddress: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa",
            collateralAmount: 1000,
            loanAssetAddress: "0xe9DcE89B076BA6107Bb64EF30678efec11939234",
            loanAmount: 1000,
            loanYield: 5,
            duration: 1000,
            expiration: 0,
            borrower: "0x0000000000000000000000000000000000000000",
            lender: "0x75f25C7f75992b17EEC14B7e702BD4b55C763f49",
            isPersistent: false,
            nonce: "0xb81415eeea3b749577614cd7eee7670471ea30e96b9c7aba53f4dcb8576be57f",
        }
    ]

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
                    <StyledSelect
                        defaultValue={""}
                    >
                        <option value="" disabled hidden>Collateralized lending</option>
                    </StyledSelect>
                </SelectWrapper>
                {loanOffers.length ? (
                    <>
                        <LoanOfferTable />
                    </>
                ) : (
                    <>
                        <p>
                            {t('marketplace.noOpportunities')}
                        </p>
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
    className: `flex items-center h-6 space-x-1.5 p-0.75 px-2 text-ui-600 
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
