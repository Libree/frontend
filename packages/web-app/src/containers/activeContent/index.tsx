import React from 'react';
import { IconArrowRight, IconPerson } from '@aragon/ui-components';
import styled from 'styled-components';

import AaveLogo from '../../public/aave-logo.png';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useDaoVault } from 'hooks/useDaoVault';
import { useAaveData } from 'hooks/useAaveData';

ChartJS.register(ArcElement, Tooltip, Legend);

export const ActiveContent = () => {

    const { totalAssetValue } = useDaoVault()
    const { netWorth: aaveNetWorth } = useAaveData()

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
                    <ActiveGroupsList />
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

const ActiveGroupsList = () => {
    const activeGroups = [
        { title: 'Credit Delegation', value: 12000, percentage: 12.4 },
        { title: 'Operations', value: 12000, percentage: 6.4 },
    ];
    return (
        <>
            <Title>Active Groups</Title>
            <ActiveGroupsContainer>
                {activeGroups.map((group, index) => (
                    <ActiveGroupCardContainer key={index}>
                        <div className='flex space-x-1'>
                            <IconPerson className='w-2 h-2 tablet:w-3 tablet:h-3 text-ui-400' />
                            <ActiveGroupCardData>
                                <CardTitle>{group.title}</CardTitle>
                                <div className='flex items-center justify-center space-x-2'>
                                    <CardTag>
                                        {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD',
                                        }).format(group.value)}
                                    </CardTag>
                                    <CardTag>{group.percentage}%</CardTag>
                                </div>
                                <div className='w-full flex justify-end'>
                                    <IconArrowRight />
                                </div>
                            </ActiveGroupCardData>
                        </div>
                    </ActiveGroupCardContainer>
                ))}
            </ActiveGroupsContainer>
        </>
    )
};

const ActiveGroupsContainer = styled.div.attrs({
    className: 'flex space-x-2 tablet:space-x-3 overflow-x-auto h-20 w-full'
})``;

const ActiveGroupCardContainer = styled.div.attrs({
    className: 'flex flex-col bg-ui-50 border shadow-sm rounded-lg p-2 w-[20rem] min-w-[20rem] h-16 space-y-1',
})``;

const ActiveGroupCardData = styled.div.attrs({
    className: 'flex flex-col items-left space-y-1 tablet:space-y-2',
})``;

/*************************************************
 *            Active Investments List            *
 *************************************************/

const ActiveInvestmentsList = (
    { aaveNetWorth, totalAssetValue }:
        { aaveNetWorth: number, totalAssetValue: number }
) => {

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
    return (
        <>
            <Title>Active Investments</Title>
            <ActiveInvestContainer>
                {activeInvestments.map((item, index) => (
                    <CardContainer key={index}>
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
                ))}
            </ActiveInvestContainer>
        </>
    )
};

const ActiveInvestContainer = styled.div.attrs({
    className: 'flex flex-col space-y-2 h-15 overflow-auto pr-1',
})``;

const CardContainer = styled.div.attrs({
    className: 'bg-ui-50 grid grid-cols-12 items-center border shadow-sm rounded-full py-1 px-1 tablet:px-4',
})``;

const StyledImg = styled.img.attrs({
    className: 'w-3 h-3 tablet:w-4 tablet:h-4 rounded-full',
})``;

const ImgContainer = styled.div.attrs({
    className: 'col-span-2 desktop:col-span-2 flex flex-col items-center',
})``;

const CardTitle = styled.p.attrs({
    className: 'text-ui-700 font-bold text-base',
})``;

const TitleContainer = styled.div.attrs({
    className: 'col-span-3 desktop:col-span-2 flex flex-col items-center',
})``;

const CardTag = styled.p.attrs({
    className: 'text-ui-500 font-bold text-sm px-1 py-0.5 rounded-lg bg-ui-100',
})``;

const TagsContainer = styled.div.attrs({
    className: 'col-span-7 desktop:col-span-8 flex items-center tablet:pl-1 space-x-1 tablet:space-x-3',
})``;
