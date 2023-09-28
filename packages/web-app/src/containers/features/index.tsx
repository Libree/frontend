import React, { useMemo } from 'react';
import styled from 'styled-components';

import FeatureCard from 'components/featureCard';
import { FeatureCards } from 'components/featureCard/data';
import useScreen from 'hooks/useScreen';

const MainFeatures: React.FC = () => {
  const { isMobile } = useScreen();

  const ctaList = useMemo(
    () =>
      FeatureCards.map(card => (
        <FeatureCard
          key={card.title}
          {...card}
          className="flex-1"
        />
      )),
    []
  );

  if (isMobile) {
    return (
      <MobileContainer>
        <MobileCTA>{ctaList}</MobileCTA>
      </MobileContainer>
    );
  } else {
    return (
      <DesktopContainer>
        <DesktopCTA>{ctaList}</DesktopCTA>
      </DesktopContainer>
    );
  }
};

const DesktopContainer = styled.div.attrs({
  className: 'flex flex-col space-y-2 -mt-16 mb-4',
})``;

const MobileContainer = styled.div.attrs({
  className: 'flex flex-col space-y-2 -mt-13 mb-5',
})``;

const DesktopCTA = styled.div.attrs({
  className:
    'relative grid grid-cols-3 gap-3 max-w-fit',
})``;

const MobileCTA = styled.div.attrs({
  className: 'relative grid grid-cols-2 gap-1 max-w-fit',
})``;

export default MainFeatures;
