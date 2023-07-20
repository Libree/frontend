import {
    ListItemAction,
} from '@aragon/ui-components';
import React, { useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const SelectPlugins: React.FC = () => {
    const { t } = useTranslation();
    const { control, setValue } = useFormContext();

    const handlePluginChanged = useCallback(
        (value: boolean, pluginName: string, onChange: (value: boolean) => void) => {
            if (value) {
                setValue(pluginName, true);
            }
            onChange(value);
        }
    , [setValue]);

    return (
        <>
            <Header>
                <Title>Choose plugins</Title>
            </Header>
            <PluginsContainer>
                <Controller
                    name="subGovernancePlugin"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <ListItemAction
                            bgWhite
                            mode={value ? 'selected' : 'default'}
                            title={t('createUnityDAO.step2.subGovernance.title')}
                            subtitle={t('createUnityDAO.step2.subGovernance.description')}
                            onClick={() => handlePluginChanged(!value, 'subGovernancePlugin', onChange)}
                        />
                    )}
                />
                <Controller
                    name="creditDelegationPlugin"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <ListItemAction
                            bgWhite
                            mode={value ? 'selected' : 'default'}
                            title={t('createUnityDAO.step2.creditDelegation.title')}
                            subtitle={t('createUnityDAO.step2.creditDelegation.description')}
                            onClick={() => handlePluginChanged(!value, 'creditDelegationPlugin', onChange)}
                        />
                    )}
                />
                <Controller
                    name="vaultPlugin"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <ListItemAction
                            bgWhite
                            mode={value ? 'selected' : 'default'}
                            title={t('createUnityDAO.step2.vault.title')}
                            subtitle={t('createUnityDAO.step2.vault.description')}
                            onClick={() => handlePluginChanged(!value, 'vaultPlugin', onChange)}
                        />
                    )}
                />
                <Controller
                    name="uniswapV3Plugin"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <ListItemAction
                            bgWhite
                            mode={value ? 'selected' : 'default'}
                            title={t('createUnityDAO.step2.uniswap.title')}
                            subtitle={t('createUnityDAO.step2.uniswap.description')}
                            onClick={() => handlePluginChanged(!value, 'uniswapV3Plugin', onChange)}
                        />
                    )}
                />
            </PluginsContainer>
        </>
    );
};

export default SelectPlugins;

const PluginsContainer = styled.div.attrs({
    className: 'grid grid-cols-1 tablet:grid-cols-2 gap-2',
})``;

const Header = styled.div.attrs({ className: 'flex justify-between' })``;

const Title = styled.p.attrs({ className: 'text-lg font-bold text-ui-800' })``;
