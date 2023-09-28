import styled from 'styled-components';
import React, { SyntheticEvent } from 'react';

import FallbackImg from '../../../../ui-components/src/assets/avatar-token.svg'

export type LendingCardTokenProps = {
    id?: string;
    tokenSymbol: string;
    tokenAPY: string;
    tokenImageUrl: string;
    tokenBalance: number | string;
    tokenUSDValue: string;
    bgWhite?: boolean;
    changeType: 'Positive' | 'Negative';
};

export const LendingCardToken: React.FC<LendingCardTokenProps> = ({
    bgWhite = false,
    ...props
}) => {

    return (
        <Card data-testid="cardToken" bgWhite={bgWhite}>
            <TokenDetailsWithImage>
                <TokenImage
                    src={props.tokenImageUrl}
                    onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
                        e.currentTarget.src = FallbackImg;
                    }}
                />
                <TokenDetails>
                    <TokenSymbol>{props.tokenSymbol}</TokenSymbol>
                    <ApyPercentage
                        style={{ color: props.changeType === 'Positive' ? '#00D16C' : '#FF3B69'}}
                    >
                        {`APY ${props.tokenAPY}%`}
                    </ApyPercentage>
                </TokenDetails>
            </TokenDetailsWithImage>
            <MarketProperties>
                <TokenBalance>{`${props.tokenBalance} ${props.tokenSymbol}`}</TokenBalance>
                <FiatValue>{props.tokenUSDValue}</FiatValue>
            </MarketProperties>
        </Card>
    );
};

type CardProps = Pick<LendingCardTokenProps, 'bgWhite'>;

const Card = styled.div.attrs(({ bgWhite }: CardProps) => ({
    className: `flex flex-row justify-between space-x-4 items-center py-1.5 tablet:py-2.5 px-2.5 tablet:px-3 overflow-hidden ${bgWhite ? 'bg-ui-50' : 'bg-ui-0'
        } rounded-xl`,
})) <CardProps>``;

const TokenDetailsWithImage = styled.div.attrs({
    className: 'flex items-center flex-auto',
})``;

const TokenImage = styled.img.attrs(({ src }) => ({
    className: 'w-3 h-3 tablet:h-5 tablet:w-5 rounded-full',
    src,
}))``;

const TokenDetails = styled.div.attrs({
    className: 'ml-2 tablet:space-y-1 overflow-hidden py-1 tablet:py-0',
})``;

const TokenSymbol = styled.h1.attrs({
    className: 'font-bold text-ui-800 truncate',
})``;

const ApyPercentage = styled.div.attrs({
    className: 'ft-text-sm text-ui-500 space-x-0.5 tablet:flex',
})``;

const MarketProperties = styled.div.attrs({
    className: 'ft-text-sm ml-2 pl-1 tablet:pl-0 text-right tablet:space-y-1 tablet:flex-auto tablet:overflow-hidden',
})``;

const TokenBalance = styled.h1.attrs({
    className: 'text-ui-500 my-[0.1rem] tablet:my-0',
})``;

const FiatValue = styled.div.attrs({
    className: 'text-ui-500 my-[0.1rem] tablet:my-0',
})``;
