import styled from 'styled-components';
import React, { SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import FallbackImg from '../../../../ui-components/src/assets/avatar-token.svg'

export type CardGroupProps = {
  groupId: string;
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
  const navigate = useNavigate();

  /*************************************************
     *                    Handlers                   *
     *************************************************/
  const navigateToGroupDetails = () => {
    navigate(props.groupId);
  };

  return (
    <Card data-testid="cardToken" bgWhite={bgWhite} onClick={() => navigateToGroupDetails()}>
      <GroupDetailsWithImage>
        <GroupImage
          src={props.groupImageUrl}
          onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
            e.currentTarget.src = FallbackImg;
          }}
        />
        <GroupDetails>
          <GroupName>{props.groupName}</GroupName>
          <SecondaryGroupDetails>{props.groupDescription}</SecondaryGroupDetails>
        </GroupDetails>
      </GroupDetailsWithImage>
      <MarketProperties>
        <MemberCount>{`${props.memberCount} Members`}</MemberCount>
        <FiatValue>{props.groupUSDValue}</FiatValue>
      </MarketProperties>
    </Card>
  );
};

type CardProps = Pick<CardGroupProps, 'bgWhite'>;

const Card = styled.div.attrs(({ bgWhite }: CardProps) => ({
  className: `flex flex-col tablet:flex-row justify-between space-x-4 tablet:items-center py-1.5 tablet:py-2.5 px-2.5 tablet:px-3 overflow-hidden ${bgWhite ? 'bg-ui-50' : 'bg-ui-0'
    } rounded-xl hover:shadow-100 hover:bg-ui-100 cursor-pointer`,
})) <CardProps>``;

const GroupDetailsWithImage = styled.div.attrs({
  className: 'flex items-center flex-auto',
})``;

const GroupImage = styled.img.attrs(({ src }) => ({
  className: 'w-3 h-3 tablet:h-5 tablet:w-5 rounded-full',
  src,
}))``;

const GroupDetails = styled.div.attrs({
  className: 'ml-2 tablet:space-y-1 overflow-hidden py-1 tablet:py-0',
})``;

const GroupName = styled.h1.attrs({
  className: 'font-bold text-ui-800 truncate',
})``;

const SecondaryGroupDetails = styled.div.attrs({
  className: 'ft-text-sm text-ui-500 space-x-0.5 tablet:flex',
})``;

const MarketProperties = styled.div.attrs({
  className: 'ft-text-sm ml-2 pl-1 tablet:pl-0 tablet:text-right tablet:space-y-1 tablet:flex-auto tablet:overflow-hidden',
})``;

const MemberCount = styled.h1.attrs({
  className: 'text-ui-500 my-[0.1rem] tablet:my-0',
})``;

const FiatValue = styled.div.attrs({
  className: 'text-ui-500 my-[0.1rem] tablet:my-0',
})``;
