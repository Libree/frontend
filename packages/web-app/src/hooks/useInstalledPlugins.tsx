import { useEffect, useState } from 'react';
import { InstalledPluginListItem } from '@aragon/sdk-client';
import { fetchDaoPlugins } from 'services/aragon';
import { PLUGIN_IDS } from 'utils/config';

export interface IUseInstalledPlugins {
  creditDelegation: InstalledPluginListItem | null
}

export const useInstalledPlugins = (daoAddress: string | undefined): IUseInstalledPlugins => {
  //TODO: add support to all networks
  const network = 'mumbai'
  const [creditDelegation, setCreditDelegation] = useState<InstalledPluginListItem | null>(null);

  const setPlugins = async (daoAddress: string) => {
    const installedPlugins = await fetchDaoPlugins(daoAddress, network)
    const creditDelegationPlugin = installedPlugins?.find(
      //TODO: add support to all networks
      plugin => plugin.id === PLUGIN_IDS['maticmum'].creditDelegation
    )
    setCreditDelegation(creditDelegationPlugin ? creditDelegationPlugin : null)
  }

  useEffect(() => {
    if (daoAddress && network) {
      setPlugins(daoAddress)
    }
  }, [daoAddress, network]);

  return {
    creditDelegation
  };
};
