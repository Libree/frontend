import React from 'react';
import styled from 'styled-components';
import useScreen from 'hooks/useScreen';

type Props = {
  className?: string;
  images: any[];
  title: string;
  description: string;
};

const FeatureCard: React.FC<Props> = props => {
  const { isTablet, isDesktop } = useScreen();

  return (
    <CTACardWrapper className={props.className}>
      <Content>
        <Title>{props.title}</Title>
        <Subtitle>{props.description}</Subtitle>
      </Content>

      <div className='absolute bottom-2 sm:bottom-3 right-2 sm:right-3'>
        <div className='flex items-center h-10'>
          <RenderImages images={props.images} />
        </div>
      </div>

    </CTACardWrapper>
  );
};

export default FeatureCard;

const CTACardWrapper = styled.div.attrs({
  className:
    'flex flex-col desktop:items-left items-center p-3 space-y-3 rounded-xl relative desktop:m-0 mb-3 mx-1' as string,
})`
  background: rgba(255, 255, 255, 1);
`;

const Content = styled.div.attrs({
  className: 'flex max-h-[4rem] desktop:max-h-none desktop:items-start items-center flex-col desktop:mb-0 mb-3',
})``;

const Title = styled.p.attrs({
  className: 'ft-text-2xl font-bold text-ui-800 desktop:mt-2 mt-0',
})``;

const Subtitle = styled.p.attrs({
  className: 'text-ui-600 h-12 ft-text-base desktop:mt-2 mt-1.5',
})``;


export const RenderImages = ({ images }: { images: any[] }) => {
  return (
    <>
      {images?.map((image, index) => (
        <img
          key={`${image}-${index}`}
          src={image}
          alt=""
          className="h-full w-fit rounded-full"
          style={{ marginLeft: index !== 0 ? '-5%' : '0' }}
        />
      ))}
    </>
  )
};
