import React, { useState } from 'react';
import { IconPerson } from '@aragon/ui-components';
import styled from 'styled-components';
import { Carousel } from 'react-responsive-carousel';
import { IconArrowLeft } from '@aragon/ui-components';
import { IconArrowRight } from '@aragon/ui-components';

interface ActiveGroupsSliderProps {
    activeGroups: Array<{
        title: string;
        value: number;
        percentage: number;
    }>;
};

export const ActiveGroupsSlider = ({ activeGroups }: ActiveGroupsSliderProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const next = () => setCurrentSlide(currentSlide + 1);
    const prev = () => setCurrentSlide(currentSlide - 1);

    return (
        <Carousel
            showStatus={false}
            showThumbs={false}
            autoPlay={false}
            infiniteLoop={false}
            showIndicators={false}
            className='flex space-x-3'
            width={240}

        >
            {activeGroups.map((group, index) => (
                <div key={index} className='flex flex-col bg-ui-50 border shadow-sm rounded-lg p-0.5 tablet:p-2 w-30 h-15 space-y-1'>
                    <div className='flex space-x-2'>
                        <IconPerson className='w-2 h-2 tablet:w-3 tablet:h-3 text-ui-400' />
                        <div className='flex flex-col items-center space-y-1 tablet:space-y-2'>
                            <CardTitle>{group.title}</CardTitle>
                            <div className='flex items-center justify-center space-x-2'>
                                <CardTag>${group.value}</CardTag>
                                <CardTag>{group.percentage}%</CardTag>
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center justify-between'>
                        <IconArrowLeft />
                        <IconArrowRight />
                    </div>
                </div>
            ))}
        </Carousel>
    )
};

const CardTitle = styled.p.attrs({
    className: 'text-ui-700 font-bold text-base',
})``;

const CardTag = styled.p.attrs({
    className: 'text-ui-500 font-bold text-sm px-1 py-0.5 rounded-lg bg-ui-100',
})``;
