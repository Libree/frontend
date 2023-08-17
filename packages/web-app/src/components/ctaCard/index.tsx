import React from 'react';
import styled from 'styled-components';
import {ButtonText} from '@aragon/ui-components';
import useScreen from 'hooks/useScreen';

type Props = {
  // temporary property, to be removed once all actions available
  actionAvailable?: boolean;
  actionLabel: string;
  className?: string;
  path: string;
  imgSrc?: string;
  onClick: (path: string) => void;
  subtitle: string;
  title: string;
};

const CTACard: React.FC<Props> = props => {
  const {isTablet, isDesktop} = useScreen();

  return (
    <CTACardWrapper className={props.className}>
      <Content>
        {isDesktop ? (
          <StyledImg src={props.imgSrc} />
        ) : (
          <div style={{width: isTablet ? '6rem' : '4rem'}}>
            <img src={props.imgSrc} />
          </div>
        )}
        <Title>{props.title}</Title>
        <Subtitle>{props.subtitle}</Subtitle>
      </Content>

      <ButtonWrapper>
        <ButtonText
          size="large"
          label={props.actionLabel}
          {...(props.actionAvailable
            ? {mode: 'primary'}
            : {mode: 'ghost', disabled: true})}
          onClick={() => props.onClick(props.path)}
          className={`${!isDesktop && 'w-full'}`}
        />
      </ButtonWrapper>
    </CTACardWrapper>
  );
};

export default CTACard;

const CTACardWrapper = styled.div.attrs({
  className:
    'flex flex-col desktop:items-left items-center p-3 space-y-3 rounded-xl relative desktop:m-0 mb-3 mx-1' as string,
})`
  background: rgba(255, 255, 255, 1);
`;

const Content = styled.div.attrs({
  className:
    'flex max-h-[4rem] desktop:max-h-none desktop:items-start items-center flex-col desktop:mb-0 mb-3',
})``;

const Title = styled.p.attrs({
  className: 'ft-text-2xl font-bold text-ui-800 desktop:mt-2 mt-0',
})``;

const Subtitle = styled.p.attrs({
  className: 'text-ui-600 h-12 ft-text-base desktop:mt-2 mt-1.5',
})``;

const StyledImg = styled.img.attrs({
  className: 'h-12 w-12',
})``;

const ButtonWrapper = styled.div.attrs({
  className: 'w-full flex flex-col desktop:items-start desktop:mt-0',
})``;
