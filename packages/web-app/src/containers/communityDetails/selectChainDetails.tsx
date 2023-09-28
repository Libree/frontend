import {
    ButtonText,
    ListItemBlockchain,
} from '@aragon/ui-components';
import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { useNetwork } from 'context/network';
import useScreen from 'hooks/useScreen';
import { CHAIN_METADATA, PRODUCTION_ENABLED, SupportedNetworks } from 'utils/constants';

type NetworkType = 'main' | 'test';

const SelectChainDetails: React.FC = () => {
    const { t } = useTranslation();
    const { isMobile } = useScreen();
    const { setNetwork } = useNetwork();
    const { control, resetField } = useFormContext();

    const [networkType, setNetworkType] = useState<NetworkType>('test');

    return (
        <>
            <Header>
                <NetworkTypeSwitcher>
                    {PRODUCTION_ENABLED === 'true' && (
                        <ButtonText
                            mode="ghost"
                            bgWhite
                            size={isMobile ? 'small' : 'medium'}
                            label={t('labels.mainNet')}
                            isActive={networkType === 'main'}
                            onClick={() => {
                                setNetworkType('main');
                            }}
                        />
                    )}
                    <ButtonText
                        mode="ghost"
                        bgWhite
                        size={isMobile ? 'small' : 'medium'}
                        label={t('labels.testNet')}
                        isActive={networkType === 'test'}
                        onClick={() => setNetworkType('test')}
                    />
                </NetworkTypeSwitcher>
            </Header>
            <FormItem>
                {networks[networkType]['cost'].map(selectedNetwork => (
                    <Controller
                        key={selectedNetwork}
                        name="blockchain"
                        rules={{ required: true }}
                        control={control}
                        render={({ field }) => (
                            <ListItemBlockchain
                                onClick={() => {
                                    setNetwork(selectedNetwork);
                                    field.onChange({
                                        id: CHAIN_METADATA[selectedNetwork].id,
                                        label: CHAIN_METADATA[selectedNetwork].name,
                                        network: networkType,
                                    });
                                    if (!CHAIN_METADATA[selectedNetwork].supportsEns) {
                                        // reset daoEnsName if network changed to L2
                                        resetField('daoEnsName');
                                    }
                                }}
                                selected={CHAIN_METADATA[selectedNetwork].id === field?.value?.id}
                                {...CHAIN_METADATA[selectedNetwork]}
                            />
                        )}
                    />
                ))}
            </FormItem>
        </>
    );
};

export default SelectChainDetails;

const Header = styled.div.attrs({ className: 'flex justify-between' })``;

const NetworkTypeSwitcher = styled.div.attrs({
    className: 'flex p-0.5 space-x-0.25 bg-ui-0 rounded-xl',
})``;

const FormItem = styled.div.attrs({
    className: 'space-x-1.5 tablet:grid tablet:grid-cols-2 tablet:gap-4',
})``;

// Note: Default Network name in polygon network is different than Below list
type SelectableNetworks = Record<
    NetworkType,
    {
        cost: SupportedNetworks[];
        popularity: SupportedNetworks[];
        security: SupportedNetworks[];
    }
>;

const networks: SelectableNetworks = {
    main: {
        cost: ['polygon', 'ethereum'],
        popularity: ['polygon', 'ethereum', 'arbitrum'],
        security: ['ethereum', 'arbitrum', 'polygon'],
    },
    test: {
        cost: ['mumbai', 'goerli'],
        popularity: ['mumbai', 'goerli', 'arbitrum-test'],
        security: ['goerli', 'arbitrum-test', 'mumbai'],
    },
};
