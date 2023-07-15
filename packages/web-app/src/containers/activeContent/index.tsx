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
        <div
            className={`bg-white w-full -mx-2 tablet:col-span-full
            tablet:w-full tablet:mx-0 desktop:col-start-2 desktop:col-span-10
            tablet:mt-3 rounded-lg shadow-100 p-2 tablet:p-3 desktop:p-6
            border border-ui-100`}
        >
            <div className='grid grid-cols-12 gap-4'>
                <div className='desktop:col-span-3 desktop:col-start-2'>
                    <Doughnut data={doughnutData} className='p-2' />
                </div>
                <div className='desktop:col-span-5 desktop:col-start-6'>
                    {/* active groups slider */}
                    <div>
                        <Title>Active Groups</Title>
                        <ActiveGroupsSlider activeGroups={activeGroups} />
                    </div>

                    {/* active investments list */}
                    <div>
                        <Title>Active Investments</Title>
                        <div className='flex flex-col space-y-2 h-15 overflow-auto pr-4'>
                            {activeInvestments.map((item, index) => (
                                <div key={index} className='flex items-center bg-ui-50 border shadow-sm rounded-full py-1 px-4 space-x-3'>
                                    <img src={item.imgUrl} alt={item.name} className='w-2 h-2 tablet:w-4 tablet:h-4 rounded-full' />
                                    <CardTitle>{item.name}</CardTitle>
                                    <CardTag>${item.value}</CardTag>
                                    <CardTag>{item.percentage}%</CardTag>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

const Title = styled.p.attrs({
    className: 'text-ui-800 font-bold text-lg mt-3 mb-1',
})``;

const CardTitle = styled.p.attrs({
    className: 'text-ui-700 font-bold text-base',
})``;

const CardTag = styled.p.attrs({
    className: 'text-ui-500 font-bold text-sm px-1 py-0.5 rounded-lg bg-ui-100',
})``;
