import styled from 'styled-components';
import React, {SyntheticEvent} from 'react';

import FallbackImg from '../../../../ui-components/src/assets/avatar-token.svg'

export type CardGroupProps = {
  groupName: string;
  groupDescription: string;
  groupImageUrl: string;
  memberCount: number | string;
  groupUSDValue: string;
  bgWhite?: boolean;
};

export const CardGroup: React.FC<CardGroupProps> = ({
  bgWhite = false,
  ...props
}) => {

  return (
    <Card data-testid="cardToken" bgWhite={bgWhite}>
      <CoinDetailsWithImage>
        <CoinImage
          src={props.groupImageUrl}
          onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
            e.currentTarget.src = FallbackImg;
          }}
        />
        <CoinDetails>
          <CoinNameAndAllocation>
            <CoinName>{props.groupName}</CoinName>
          </CoinNameAndAllocation>
            <SecondaryCoinDetails>
              <div className="flex space-x-0.5">
                <div>{props.groupDescription}</div>
              </div>
            </SecondaryCoinDetails>
        </CoinDetails>
      </CoinDetailsWithImage>
      <MarketProperties>
        <FiatValue>
            <div className="truncate">{`${props.memberCount} Members`}</div>
        </FiatValue>

        <SecondaryFiatDetails>
            <div className="truncate">{props.groupUSDValue}</div>
        </SecondaryFiatDetails>
      </MarketProperties>
    </Card>
  );
};

type CardProps = Pick<CardGroupProps, 'bgWhite'>;

const Card = styled.div.attrs(({bgWhite}: CardProps) => ({
  className: `flex justify-between space-x-4 items-center py-2.5 px-3 overflow-hidden ${
    bgWhite ? 'bg-ui-50' : 'bg-ui-0'
  } rounded-xl`,
}))<CardProps>``;

const CoinDetailsWithImage = styled.div.attrs({
  className: 'flex items-center flex-auto',
})``;

const CoinImage = styled.img.attrs(({src}) => ({
  className: 'w-3 h-3 tablet:h-5 tablet:w-5 rounded-full',
  src,
}))``;

const CoinDetails = styled.div.attrs({
  className: 'ml-2 space-y-1 overflow-hidden',
})``;

const CoinNameAndAllocation = styled.div.attrs({
  className: 'flex items-start space-x-1',
})``;

const CoinName = styled.h1.attrs({
  className: 'font-bold text-ui-800 truncate',
})``;

const SecondaryCoinDetails = styled.div.attrs({
  className: 'ft-text-sm text-ui-500 space-x-0.5 tablet:flex',
})``;

const MarketProperties = styled.div.attrs({
  className: 'ft-text-sm text-right space-y-1 flex-auto overflow-hidden',
})``;

const FiatValue = styled.h1.attrs({
  className: 'text-ui-500',
})``;

const SecondaryFiatDetails = styled.div.attrs({
  className:
    'text-ui-500 space-x-1 flex justify-end items-center truncate',
})``;
