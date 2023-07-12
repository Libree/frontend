import React, {useEffect} from 'react';
import {useFormContext, useWatch} from 'react-hook-form';
import {useTranslation} from 'react-i18next';

import CreateNewToken from './createNewToken';

const SetupCommunityForm: React.FC = () => {
  const {t} = useTranslation();

  const {setValue} = useFormContext();
  const membership = useWatch({
    name: 'membership',
  });

  useEffect(() => {
    if (membership === 'token') {
      setValue('eligibilityType', 'token');
    } else if (membership === 'multisig') {
      setValue('eligibilityType', 'multisig');
    }
  }, [membership, setValue]);

  return (
    <>
      <CreateNewToken />
    </>
  );
};

export default SetupCommunityForm;
