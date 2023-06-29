import React from 'react';
import styled from 'styled-components';
import Logo from 'public/coloredLogo.svg';
import Green from 'public/circleGreenGradient.svg';
import Purple from 'public/purpleGradient.svg';
import LogoBg from 'public/libree-bg-logo.png';
import { useTranslation } from 'react-i18next';
import { GridLayout } from 'components/layout';

function Hero() {
  const { t } = useTranslation();
  return (
    <Container>

      <MobileLogoWrapper>
        <MobileLogo src={LogoBg} />
      </MobileLogoWrapper>

      <DesktopLogoWrapper>
        <img src={LogoBg} />
      </DesktopLogoWrapper>

      <GridLayout>
        <Wrapper>
          <ContentWrapper>
            <Title>{t('explore.hero.title')}</Title>
            <Subtitle>{t('explore.hero.subtitle1')}</Subtitle>
          </ContentWrapper>
          <ImageWrapper>
            {/* <StyledImage src={Logo} /> */}
          </ImageWrapper>
          <GradientContainer>
            <GradientWrapper>
              {/* <GradientGreen src={Green} /> */}
              {/* <GradientPurple src={Purple} /> */}
            </GradientWrapper>
          </GradientContainer>
        </Wrapper>
      </GridLayout>
    </Container>
  );
}

// NOTE: "h-56 -mt-10 pt-10" is the "simplest" way to achieve a sticky header
// with a gradient AND a primary 400 background. What it does it is extends the
// hero by a height of 12, moves it up using the negative margin and compensates
// by lowering the content using the padding-top. Same with factor 12 on
// desktop.
const Container = styled.div.attrs({
  className:
    'relative bg-neutral-100 h-56 -mt-10 pt-10 desktop:h-67 desktop:pt-12 desktop:-mt-12 overflow-hidden',
})``;

const Wrapper = styled.div.attrs({
  className:
    'flex justify-center desktop:justify-between col-span-full desktop:col-start-2 desktop:col-end-12 relative',
})``;

const ContentWrapper = styled.div.attrs({
  className: 'desktop:space-y-0.75 space-y-1 max-w-lg pt-4.5 desktop:pt-10',
})``;

const Title = styled.h1.attrs({
  className:
    'text-ui-0 font-bold ft-text-5xl desktop:text-left text-center desktop:leading-7.5 leading-4.5',
})`
  font-family: Syne;
  letter-spacing: -0.03em;
`;

const Subtitle = styled.h3.attrs({
  className:
    'text-ui-0 ft-text-lg font-normal text-center desktop:text-left leading-3 desktop:leading-3.75',
})``;

const ImageWrapper = styled.div.attrs({
  className: 'h-full',
})``;

const MobileLogoWrapper = styled.div.attrs({
  className: 'absolute mt-10 top-0 left-0 w-full h-full flex justify-center items-center object-cover desktop:hidden',
})``;

const MobileLogo = styled.img.attrs({
  className: 'w-full h-full object-cover opacity-40 tablet:opacity-50',
})``;

const DesktopLogoWrapper = styled.div.attrs({
  className: 'absolute hidden desktop:block left-1/3 top-4 opacity-90',
})``;

const StyledImage = styled.img.attrs({
  className: 'w-71 hidden desktop:block',
})``;

const GradientContainer = styled.div.attrs({
  className: 'absolute top-64 desktop:top-20 right-0 w-71',
})``;

const GradientWrapper = styled.div.attrs({
  className: 'relative w-full h-full',
})``;

const GradientGreen = styled.img.attrs({
  className: 'h-40 absolute desktop:-left-14 desktop:-top-20 -top-19 left-14',
})``;

const GradientPurple = styled.img.attrs({
  className:
    'desktop:h-40 h-30 absolute desktop:-right-20 desktop:top-5 -right-5 -top-6',
})``;

export default Hero;
