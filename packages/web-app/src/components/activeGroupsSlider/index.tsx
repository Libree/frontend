import React from 'react';
import { IconPerson, IconArrowRight } from '@aragon/ui-components';
import styled from 'styled-components';

interface ActiveGroupsSliderProps {
    activeGroups: Array<{
        title: string;
        value: number;
        percentage: number;
    }>;
};

export const ActiveGroupsSlider = ({ activeGroups }: ActiveGroupsSliderProps) => {
    return (
        <div className='flex space-x-2 tablet:space-x-3 overflow-x-auto h-20 w-full'>
            {activeGroups.map((group, index) => (
                <div key={index} className='flex flex-col bg-ui-50 border shadow-sm rounded-lg p-2 w-[20rem] min-w-[20rem] h-16 space-y-1'>
                    <div className='flex space-x-1'>
                        <IconPerson className='w-2 h-2 tablet:w-3 tablet:h-3 text-ui-400' />
                        <div className='flex flex-col items-left space-y-1 tablet:space-y-2'>
                            <CardTitle>{group.title}</CardTitle>
                            <div className='flex items-center justify-center space-x-2'>
                                <CardTag>${group.value}</CardTag>
                                <CardTag>{group.percentage}%</CardTag>
                            </div>
                            <div className='w-full flex justify-end'>
                                <IconArrowRight />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
};

const CardTitle = styled.p.attrs({
    className: 'text-ui-700 font-bold text-md text-left truncate',
})``;

const CardTag = styled.p.attrs({
    className: 'text-ui-500 font-bold text-sm px-1 py-0.5 rounded-lg bg-ui-100',
})``;
