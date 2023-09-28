import AaveLogo from 'public/aave-logo.png';
import PwnLogo from 'public/pwn-logo.png';
import AragonLogo from 'public/aragon-logo.png';
import OpenseaLogo from 'public/opensea-logo.png';
import UniswapLogo from 'public/uniswap-logo.png';
import SuperfluidLogo from 'public/superfluid-logo.png';
import DashboardLogo from 'public/dashboard-logo.png';

const FeatureCards = [
  {
    title: 'Productive Treasury',
    description: 'Make your treasury efficient from day 1 without any effort and get a yield',
    images: [AaveLogo]
  },
  {
    title: 'Credit Delegation',
    description: 'Leverage your treasury. Lend to others using losing your exposure to your tokens',
    images: [PwnLogo]
  },
  {
    title: 'Advance governance',
    description: 'Create sub-groups and grant them a delegation of authority and specific vault',
    images: [AragonLogo]
  },
  {
    title: 'Easy & Secure',
    description: 'Buy, invest or swap NFTs and tokens without the need of 3rd parties',
    images: [OpenseaLogo, UniswapLogo]
  },
  {
    title: 'Cash flow backed loans',
    description: 'Invest in loans collateralised by cash flows',
    images: [SuperfluidLogo]
  },
  {
    title: 'Comprehensive Dashboard',
    description: 'Track your DAOs performance and make informed decisions with an all in one tool',
    images: [DashboardLogo]
  }
];

export { FeatureCards };
