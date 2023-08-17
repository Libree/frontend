import React, {useEffect} from 'react';
import {Label} from '@aragon/ui-components';
import {Controller, useFormContext, useWatch} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components';
import {ActionIndex, CollateralType, FundingSource} from 'utils/types';

const fundingSourceOptions: {
  label: string;
  value: FundingSource;
}[] = [
  {label: 'DAO treasury', value: 'DAO'},
  {label: 'Aave borrow', value: 'AAVE'},
];

const collateralTypeOptions: {
  label: string;
  value: CollateralType;
}[] = [
  {label: 'ERC20 token', value: 'ERC20'},
  {label: 'NFT token', value: 'NFT'},
];

type FundOpportunityActionProps = ActionIndex;

const FundOpportunityAction: React.FC<FundOpportunityActionProps> = ({
  actionIndex,
}) => {
  const {t} = useTranslation();
  const {control, setValue} = useFormContext();

  const [name] = useWatch({
    control: control,
    name: [`actions.${actionIndex}.name`],
  });

  /*************************************************
   *                    Hooks                      *
   *************************************************/
  useEffect(() => {
    if (!name) {
      setValue(`actions.${actionIndex}.name`, 'fund_opportunity');
    }
  }, [actionIndex, name, setValue]);

  /*************************************************
   *                    Render                     *
   *************************************************/
  return (
    <Container>
      {/* Source of funding */}
      <FormItem>
        <Label label={t('marketplace.fundOpportunity.fundingSource')} />

        <Controller
          name={`actions.${actionIndex}.inputs.fundingSource`}
          control={control}
          render={({field: {onChange, value, name}}) => (
            <StyledSelect {...{name, value, onChange}} defaultValue={''}>
              <option value="" disabled>
                {t('labels.selectAnOption')}
              </option>
              {fundingSourceOptions.map(item => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </StyledSelect>
          )}
        />
      </FormItem>

      {/* Collateral Type */}
      <FormItem>
        <Label label={t('marketplace.fundOpportunity.collateralType')} />

        <Controller
          name={`actions.${actionIndex}.inputs.collateralType`}
          control={control}
          render={({field: {onChange, value, name}}) => (
            <StyledSelect {...{name, value, onChange}} defaultValue={''}>
              <option value="" disabled>
                {t('labels.selectAnOption')}
              </option>
              {collateralTypeOptions.map(item => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </StyledSelect>
          )}
        />
      </FormItem>
    </Container>
  );
};

export default FundOpportunityAction;

const Container = styled.div.attrs({
  className: 'flex flex-col w-full space-y-2',
})``;

const FormItem = styled.div.attrs({
  className: 'flex flex-col w-full',
})``;

const StyledSelect = styled.select.attrs({
  className: `w-full flex items-center h-6 space-x-1.5 p-0.75 pl-2 text-ui-600 
    rounded-xl border-2 border-ui-100 focus-within:ring-2 focus-within:ring-primary-500
    hover:border-ui-300 active:border-primary-500 active:ring-0`,
})``;
