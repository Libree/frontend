import {AlertInline, Label, TextInput} from '@aragon/ui-components';
import React from 'react';
import styled from 'styled-components';
import {useTranslation} from 'react-i18next';
import {Controller, useFormContext} from 'react-hook-form';
import AddWallets from 'components/addWallets';
import {htmlIn} from 'utils/htmlIn';

const CreateNewToken: React.FC = () => {
  const {t} = useTranslation();
  const {control} = useFormContext();

  return (
    <Container>
      <DescriptionContainer>
        <Title>{t('labels.mintToken')}</Title>
        <Subtitle
          dangerouslySetInnerHTML={{
            __html: htmlIn(t)('createDAO.step3.createTokenHelptext'),
          }}
        ></Subtitle>
      </DescriptionContainer>

      <FormItem>
        <Label
          label={t('labels.tokenName')}
          helpText={t('createDAO.step3.nameSubtitle')}
        />

        <Controller
          name="tokenName"
          control={control}
          defaultValue=""
          rules={{
            required: t('errors.required.tokenName') as string,
          }}
          render={({
            field: {onBlur, onChange, value, name},
            fieldState: {error},
          }) => (
            <>
              <TextInput
                name={name}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
              />
              {error?.message && (
                <AlertInline label={error.message} mode="critical" />
              )}
            </>
          )}
        />
      </FormItem>

      <FormItem>
        <Label
          label={t('labels.tokenSymbol')}
          helpText={t('createDAO.step3.symbolSubtitle')}
        />

        <Controller
          name="tokenSymbol"
          control={control}
          defaultValue=""
          rules={{
            required: t('errors.required.tokenSymbol') as string,
          }}
          render={({
            field: {onBlur, onChange, value, name},
            fieldState: {error},
          }) => (
            <>
              <TextInput
                name={name}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
              />
              {error?.message && (
                <AlertInline label={error.message} mode="critical" />
              )}
            </>
          )}
        />
      </FormItem>

      <WideFormItem>
        <DescriptionContainer>
          <Label
            label={t('labels.distributeTokens')}
            helpText={t('createDAO.step3.distributeTokensHelpertext')}
          />
        </DescriptionContainer>
        <AlertInline
          label={t('createDAO.step3.distributionWalletAlertText')}
          mode="neutral"
        />
        <AddWallets />
      </WideFormItem>
    </ Container>
  );
};

export default CreateNewToken;

const Container = styled.div.attrs({
  className: 'grid grid-cols-2 gap-4',
})``;

const FormItem = styled.div.attrs({
  className: 'space-y-1.5',
})``;

const WideFormItem = styled.div.attrs({
  className: 'space-y-1.5 col-span-2',
})``;

const DescriptionContainer = styled.div.attrs({
  className: 'space-y-0.5 col-span-2',
})``;

const Title = styled.p.attrs({className: 'text-lg font-bold text-ui-800'})``;

const Subtitle = styled.p.attrs({className: 'text-ui-600 text-bold'})``;
