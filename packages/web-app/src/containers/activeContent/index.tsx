import React from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { IconArrowRight, IconPerson } from '@aragon/ui-components';
import styled from 'styled-components';

import AaveLogo from '../../public/aave-logo.png';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useDaoVault } from 'hooks/useDaoVault';
import { useAaveData } from 'hooks/useAaveData';
import { useSubgovernance } from 'hooks/useSubgovernance';
import { useNetwork } from 'context/network';
import { Lending } from 'utils/paths';

ChartJS.register(ArcElement, Tooltip, Legend);

export const ActiveContent = () => {
    const { dao } = useParams();
    const { totalAssetValue } = useDaoVault();
    const { netWorth: aaveNetWorth } = useAaveData();
    const { groupData } = useSubgovernance(dao);

    const doughnutData = {
        labels: [
            'Treasury', 'Aave'
        ],
        datasets: [{
            label: 'Asset allocation',
            data:
                [totalAssetValue - aaveNetWorth,
                    aaveNetWorth
                ],
            backgroundColor: [
                '#22d3ee',
                '#22d4ae'
            ],
            hoverOffset: 4
        }]
    };

    return (
        <ActiveContainer>
            <ActiveWrapper>

                <ChartContainer>
                    <Doughnut data={doughnutData} className='p-2' />
                </ChartContainer>

                <ActiveDataContainer>
                    <ActiveGroupsList
                        groupsData={groupData}
                    />
                    <ActiveInvestmentsList
                        aaveNetWorth={aaveNetWorth}
                        totalAssetValue={totalAssetValue} />
                </ActiveDataContainer>

            </ActiveWrapper>
        </ActiveContainer>
    )
};

const ActiveContainer = styled.div.attrs({
    className: `bg-white w-full mx-0 tablet:col-span-full
        tablet:w-full tablet:mx-0 desktop:col-start-2 desktop:col-span-10
        tablet:mt-3 rounded-lg shadow-100 p-2 tablet:p-3 desktop:p-6
        border border-ui-100`,
})``;

const ActiveWrapper = styled.div.attrs({
    className: 'grid grid-cols-12 tablet:gap-4',
})``;

const ChartContainer = styled.div.attrs({
    className: 'col-span-12 tablet:col-span-4 tablet:col-start-1',
})``;

const ActiveDataContainer = styled.div.attrs({
    className: 'col-span-12 tablet:col-span-7 tablet:col-start-6',
})``;

const Title = styled.p.attrs({
    className: 'text-ui-800 font-bold text-lg mt-3 mb-1',
})``;

/*************************************************
 *              Active Groups List               *
 *************************************************/

const ActiveGroupsList = ({ groupsData }: { groupsData: any[] | undefined }) => {

    if (!groupsData) {
        return (
            <>
                <Title>Active Groups</Title>
                <ActiveGroupsContainer>
                    <NoData>Loading...</NoData>
                </ActiveGroupsContainer>
            </>
        )
    }

    return (
        <>
            <Title>Active Groups</Title>
            <ActiveGroupsContainer>
                {groupsData.length ? (groupsData.map((group) => (
                    <ActiveGroupCardContainer key={group.id}>
                        <IconPerson className='w-2 h-2 tablet:w-3 tablet:h-3 text-ui-400' />
                        <ActiveGroupCardData>
                            <CardTitle>{group.name}</CardTitle>
                            <div className='w-full flex justify-end'>
                                <IconArrowRight />
                            </div>
                        </ActiveGroupCardData>
                    </ActiveGroupCardContainer>
                ))) : (
                    <NoData>No active groups yet</NoData>
                )}
            </ActiveGroupsContainer>
        </>
    )
};

const ActiveGroupsContainer = styled.div.attrs({
    className: 'flex space-x-2 tablet:space-x-3 overflow-x-auto h-16 desktop:h-20 w-full'
})``;

const ActiveGroupCardContainer = styled.div.attrs({
    className: 'flex bg-ui-50 border shadow-sm rounded-lg p-2 w-20 desktop:w-25 h-14 desktop:h-16 space-x-1',
})``;

const ActiveGroupCardData = styled.div.attrs({
    className: 'flex flex-col items-left w-full h-full justify-between space-y-1 tablet:space-y-2',
})``;

/*************************************************
 *            Active Investments List            *
 *************************************************/

const ActiveInvestmentsList = (
    { aaveNetWorth, totalAssetValue }:
        { aaveNetWorth: number | undefined, totalAssetValue: number | undefined }
) => {
    const { dao } = useParams();
    const { network } = useNetwork();
    const navigate = useNavigate();

    if (!aaveNetWorth || !totalAssetValue) {
        return (
            <>
                <Title>Active Investments</Title>
                <ActiveInvestContainer>
                    <NoData>Loading...</NoData>
                </ActiveInvestContainer>
            </>
        )
    }

    const aaveData = aaveNetWorth > 0 ?
        [{
            imgUrl: AaveLogo,
            name: 'AAVE',
            value: aaveNetWorth,
            percentage: ((aaveNetWorth / totalAssetValue) * 100).toFixed(2)
        }]
        :
        []

    const activeInvestments = [
        ...aaveData
    ];

    const navigateToLendingPage = () => {
        navigate(generatePath(Lending, { network: network, dao: dao }));
    };

    return (
        <>
            <Title>Active Investments</Title>
            <ActiveInvestContainer>
                {activeInvestments.length ? (activeInvestments.map((item, index) => (
                    <CardContainer key={index} onClick={navigateToLendingPage}>
                        <ImgContainer>
                            <StyledImg src={item.imgUrl} alt={item.name} />
                        </ImgContainer>
                        <TitleContainer>
                            <CardTitle>{item.name}</CardTitle>
                        </TitleContainer>
                        <TagsContainer>
                            <CardTag>
                                {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                }).format(item.value)}
                            </CardTag>
                            <CardTag>{item.percentage}%</CardTag>
                        </TagsContainer>
                    </CardContainer>
                ))) : (
                    <NoData>No active investments yet</NoData>
                )}
            </ActiveInvestContainer>
        </>
    )
};

const ActiveInvestContainer = styled.div.attrs({
    className: 'flex flex-col space-y-2 h-15 overflow-auto pr-1',
})``;

const CardContainer = styled.div.attrs({
    className: `bg-ui-50 grid grid-cols-12 items-center border shadow-sm rounded-full py-1 px-1 tablet:px-4
        cursor-pointer hover:border-ui-200`,
})``;

const StyledImg = styled.img.attrs({
    className: 'w-3 h-3 tablet:w-4 tablet:h-4 rounded-full',
})``;

const ImgContainer = styled.div.attrs({
    className: 'col-span-1 tablet:col-span-2 flex flex-col items-center',
})``;

const CardTitle = styled.p.attrs({
    className: 'text-ui-700 font-bold text-base truncate',
})``;

const TitleContainer = styled.div.attrs({
    className: 'col-span-3 desktop:col-span-2 flex flex-col items-center',
})``;

const CardTag = styled.p.attrs({
    className: 'text-ui-500 font-bold text-sm px-1 py-0.5 rounded-lg bg-ui-100',
})``;

const TagsContainer = styled.div.attrs({
    className: 'col-span-8 tablet:col-span-7 desktop:col-span-8 flex items-center tablet:pl-1 space-x-1 tablet:space-x-3',
})``;

const NoData = styled.p.attrs({
    className: 'text-ui-500 font-bold text-sm',
})``;
