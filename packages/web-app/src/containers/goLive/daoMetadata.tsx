import React from 'react';
import {AvatarDao, ListItemLink} from '@aragon/ui-components';
import {Controller, useFormContext} from 'react-hook-form';
import {useTranslation} from 'react-i18next';

import {useFormStep} from 'components/fullScreenStepper';
import {DescriptionListContainer, Dl, Dt, Dd} from 'components/descriptionList';
import {useNetwork} from 'context/network';

type DaoMetadataProps = { editionStep: number };

const DaoMetadata: React.FC<DaoMetadataProps> = ({ editionStep }) => {
  const {control, getValues} = useFormContext();
  const {setStep} = useFormStep();
  const {isL2Network} = useNetwork();
  const {t} = useTranslation();
  const {daoLogo, daoName, daoEnsName, daoSummary, links} =
    getValues();

  return (
    <Controller
      name="reviewCheck.daoMetadata"
      control={control}
      defaultValue={false}
      rules={{
        required: t('errors.required.recipient'),
      }}
      render={() => (
        <DescriptionListContainer
          title={t('labels.review.daoMetadata')}
          onEditClick={() => setStep(editionStep)}
          tagLabel={t('labels.changeableVote')}
        >
          <Dl>
            <Dt>{t('labels.logo')}</Dt>
            <Dd>
              <AvatarDao
                {...{daoName}}
                {...(daoLogo && {src: URL.createObjectURL(daoLogo)})}
                size="small"
              />
            </Dd>
          </Dl>
          <Dl>
            <Dt>{t('labels.daoName')}</Dt>
            <Dd>{daoName}</Dd>
          </Dl>
          {!isL2Network && (
            <Dl>
              <Dt>{t('labels.daoEnsName')}</Dt>
              <Dd>{`${daoEnsName}.dao.eth`}</Dd>
            </Dl>
          )}
          <Dl>
            <Dt>{t('labels.summary')}</Dt>
            <Dd>{daoSummary}</Dd>
          </Dl>
          {links[0].url !== '' && (
            <Dl>
              <Dt>{t('labels.links')}</Dt>
              <Dd>
                <div className="space-y-1.5">
                  {links.map(
                    (
                      {name, url}: {name: string; url: string},
                      index: number
                    ) => {
                      return (
                        url !== '' && (
                          <ListItemLink
                            key={index}
                            label={name}
                            href={url}
                            external
                          />
                        )
                      );
                    }
                  )}
                </div>
              </Dd>
            </Dl>
          )}
        </DescriptionListContainer>
      )}
    />
  );
};

export default DaoMetadata;
