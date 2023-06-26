import {CreateDAO} from 'utils/paths';

import learnImg from '../../public/learnDao.svg';
import createDaoImg from '../../public/createDao.svg';
import {i18n} from '../../../i18n.config';

// temporary for review
const CTACards = [
  {
    actionAvailable: true,
    actionLabel: i18n.t('cta.smart.actionLabel'),
    path: CreateDAO,
    imgSrc: createDaoImg,
    subtitle: i18n.t('cta.smart.description'),
    title: i18n.t('cta.smart.title'),
  },
  {
    actionAvailable: true,
    actionLabel: i18n.t('cta.unity.actionLabel'),
    path: CreateDAO,
    imgSrc: learnImg,
    subtitle: i18n.t('cta.unity.description'),
    title: i18n.t('cta.unity.title'),
  }
];

export {CTACards};
