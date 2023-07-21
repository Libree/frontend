import {
  CheckboxListItem,
  Label,
} from '@aragon/ui-components';
import React, { useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';


const ConfigurePlugins: React.FC = () => {
  const { t } = useTranslation();
  const { control, setValue, getValues } = useFormContext();

  /*************************************************
   *             Callbacks and Handlers            *
   *************************************************/

  const handlePluginChanged = useCallback(
    (value: boolean, pluginName: string, onChange: (value: boolean) => void) => {
      if (value) {
        setValue(pluginName, true);
      }
      onChange(value);
    },
    [getValues, setValue]
  );


  /*************************************************
   *                   Render                     *
   *************************************************/
  return (
    <>
      {
        <>
          {/* Group voting */}
          <FormItem>
            <Label
              label={t('createDAO.step5.governance.title')}
              helpText={t('createDAO.step5.governance.description')}
            />
            <Controller
              name="subGovernancePlugin"
              control={control}
              render={({ field: { onChange, value } }) => (
                <ToggleCheckList
                  onChange={changeValue =>
                    handlePluginChanged(changeValue, "subGovernancePlugin", onChange)
                  }
                  value={value as boolean}
                />
              )}
            />
          </FormItem>
          {/* Credit Delegation */}
          <FormItem>
            <Label
              label={t('createDAO.step5.creditDelegation.title')}
              helpText={t('createDAO.step5.creditDelegation.description')}
            />
            <Controller
              name="creditDelegationPlugin"
              control={control}
              render={({ field: { onChange, value } }) => (
                <ToggleCheckList
                  onChange={changeValue =>
                    handlePluginChanged(changeValue, "creditDelegationPlugin", onChange)
                  }
                  value={value as boolean}
                />
              )}
            />
          </FormItem>

          {/* Vault plugin */}
          <FormItem>
            <Label
              label={t('createDAO.step5.vault.title')}
              helpText={t('createDAO.step5.vault.description')}
            />
            <Controller
              name="vaultPlugin"
              control={control}
              render={({ field: { onChange, value } }) => (
                <ToggleCheckList
                  onChange={changeValue =>
                    handlePluginChanged(changeValue, "vaultPlugin", onChange)
                  }
                  value={value as boolean}
                />
              )}
            />
          </FormItem>

          {/* Uniswap v3 plugin */}
          <FormItem>
            <Label
              label={t('createDAO.step5.uniswap.title')}
              helpText={t('createDAO.step5.uniswap.description')}
            />
            <Controller
              name="uniswapV3Plugin"
              control={control}
              render={({ field: { onChange, value } }) => (
                <ToggleCheckList
                  onChange={changeValue =>
                    handlePluginChanged(changeValue, "uniswapV3Plugin", onChange)
                  }
                  value={value as boolean}
                />
              )}
            />
          </FormItem>
        </>
      }
    </>
  );
};

export default ConfigurePlugins;

const ToggleCheckList = ({
  disabled,
  onChange,
  value,
}: {
  disabled?: boolean;
  value: boolean;
  onChange: (value: boolean) => void;
}) => {
  const { t } = useTranslation();

  return (
    <ToggleCheckListContainer>
      <ToggleCheckListItemWrapper>
        <CheckboxListItem
          label={t('labels.no')}
          multiSelect={false}
          disabled={disabled}
          onClick={() => onChange(false)}
          type={value ? 'default' : 'active'}
        />
      </ToggleCheckListItemWrapper>

      <ToggleCheckListItemWrapper>
        <CheckboxListItem
          label={t('labels.yes')}
          multiSelect={false}
          disabled={disabled}
          onClick={() => onChange(true)}
          type={value ? 'active' : 'default'}
        />
      </ToggleCheckListItemWrapper>
    </ToggleCheckListContainer>
  );
};

const ToggleCheckListContainer = styled.div.attrs({
  className: 'flex gap-x-3',
})``;

const ToggleCheckListItemWrapper = styled.div.attrs({ className: 'flex-1' })``;

const FormItem = styled.div.attrs({
  className: 'space-y-1.5',
})``;