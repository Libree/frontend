import {CreateDAO, CreateUnityDAO} from 'utils/paths';

import salaryImg from '../../public/salary-icon.png';
import otherImg from '../../public/other-icon.png';
import {i18n} from '../../../i18n.config';

// temporary for review
const CTACards = [
  {
    actionAvailable: true,
    actionLabel: i18n.t('cta.smart.actionLabel'),
    path: CreateDAO,
    imgSrc: salaryImg,
    subtitle: i18n.t('cta.smart.description'),
    title: i18n.t('cta.smart.title'),
  },
  {
    actionAvailable: true,
    actionLabel: i18n.t('cta.unity.actionLabel'),
    path: CreateUnityDAO,
    imgSrc: otherImg,
    subtitle: i18n.t('cta.unity.description'),
    title: i18n.t('cta.unity.title'),
  }
];

export {CTACards};
