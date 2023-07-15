import React from 'react';
import styled from 'styled-components';

import AaveLogo from '../../public/aave-logo.png';
import PwnLogo from '../../public/pwn-logo.png';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ActiveGroupsSlider } from 'components/activeGroupsSlider';

ChartJS.register(ArcElement, Tooltip, Legend);

export const ActiveContent = () => {

    const activeGroups = [
        { title: 'Credit Delegation', value: 12000, percentage: 12.4 },
        { title: 'Operations', value: 12000, percentage: 6.4 },
    ];

    const activeInvestments = [
        { imgUrl: PwnLogo, name: 'PWN', value: 7000, percentage: 10.4 },
        { imgUrl: AaveLogo, name: 'AAVE', value: 12000, percentage: 3.1 },
    ];

    const doughnutData = {
        labels: [
            'Treasury',
        ],
        datasets: [{
            label: 'Treasury',
            data: [100],
            backgroundColor: [
                '#22d3ee',
            ],
            hoverOffset: 4
        }]
    };

    return (
        <ActiveContainer>
            <div className='grid grid-cols-12 gap-4'>
                <ChartContainer>
                    <Doughnut data={doughnutData} className='p-2' />
                </ChartContainer>
                <div className='col-span-12 tablet:col-span-7 tablet:col-start-6'>
                    {/* active groups slider */}
                    <div>
                        <Title>Active Groups</Title>
                        <ActiveGroupsSlider activeGroups={activeGroups} />
                    </div>

                    {/* active investments list */}
                    <div>
                        <Title>Active Investments</Title>
                        <ActiveInvestContainer>
                            {activeInvestments.map((item, index) => (
                                <CardContainer key={index}>
                                    <CardImg src={item.imgUrl} alt={item.name} />
                                    <CardTitle>{item.name}</CardTitle>
                                    <CardTag>${item.value}</CardTag>
                                    <CardTag>{item.percentage}%</CardTag>
                                </CardContainer>
                            ))}
                        </ActiveInvestContainer>
                    </div>
                </div>
            </div>
        </ActiveContainer>
    )
};

const ActiveContainer = styled.div.attrs({
    className: `bg-white w-full mx-0 tablet:col-span-full
        tablet:w-full tablet:mx-0 desktop:col-start-2 desktop:col-span-10
        tablet:mt-3 rounded-lg shadow-100 p-2 tablet:p-3 desktop:p-6
        border border-ui-100`,
})``;

const ChartContainer = styled.div.attrs({
    className: 'col-span-12 tablet:col-span-4 tablet:col-start-1',
})``;

const ActiveInvestContainer = styled.div.attrs({
    className: 'flex flex-col space-y-2 h-15 overflow-auto pr-1',
})``;

const Title = styled.p.attrs({
    className: 'text-ui-800 font-bold text-lg mt-3 mb-1',
})``;

const CardContainer = styled.div.attrs({
    className: 'flex items-center bg-ui-50 border shadow-sm rounded-full py-1 px-4 space-x-3',
})``;

const CardImg = styled.img.attrs({
    className: 'w-3 h-3 tablet:w-4 tablet:h-4 rounded-full',
})``;

const CardTitle = styled.p.attrs({
    className: 'text-ui-700 font-bold text-base',
})``;

const CardTag = styled.p.attrs({
    className: 'text-ui-500 font-bold text-sm px-1 py-0.5 rounded-lg bg-ui-100',
})``;
