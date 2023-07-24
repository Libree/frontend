import { useEffect, useState } from 'react';
import { InstalledPluginListItem } from '@aragon/sdk-client';
import { fetchDaoPlugins } from 'services/aragon';
import { PLUGIN_IDS } from 'utils/config';

export interface IUseInstalledPlugins {
  creditDelegation: InstalledPluginListItem | null,
  subgovernance: InstalledPluginListItem | null
  uniswapV3: InstalledPluginListItem | null
  vault: InstalledPluginListItem | null
}

export const useInstalledPlugins = (daoAddress: string | undefined): IUseInstalledPlugins => {
  //TODO: add support to all networks
  const network = 'mumbai'
  const [creditDelegation, setCreditDelegation] = useState<InstalledPluginListItem | null>(null);
  const [subgovernance, setSubgovernace] = useState<InstalledPluginListItem | null>(null);
  const [uniswapV3, setUniswapV3] = useState<InstalledPluginListItem | null>(null);
  const [vault, setVault] = useState<InstalledPluginListItem | null>(null);

  const getPlugin = (plugins: InstalledPluginListItem[] | undefined, id: string) => {
    return plugins?.find(plugin => plugin.id === id) 
  }


  const setPlugins = async (daoAddress: string) => {
    const installedPlugins = await fetchDaoPlugins(daoAddress, network)

    setCreditDelegation(getPlugin(installedPlugins, PLUGIN_IDS['maticmum'].creditDelegation) || null)
    setSubgovernace(getPlugin(installedPlugins, PLUGIN_IDS['maticmum'].subgovernance) || null)
    setUniswapV3(getPlugin(installedPlugins, PLUGIN_IDS['maticmum'].uniswapV3) || null)
    setVault(getPlugin(installedPlugins, PLUGIN_IDS['maticmum'].vault) || null)
  }

  useEffect(() => {
    if (daoAddress && network) {
      setPlugins(daoAddress)
    }
  }, [daoAddress, network]);

  return {
    creditDelegation,
    subgovernance,
    uniswapV3,
    vault
  };
};
