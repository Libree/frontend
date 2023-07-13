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


  const setPlugins = async (daoAddress: string) => {
    const installedPlugins = await fetchDaoPlugins(daoAddress, network)
    const creditDelegationPlugin = installedPlugins?.find(
      //TODO: add support to all networks
      plugin => plugin.id === PLUGIN_IDS['maticmum'].creditDelegation
    )
    setCreditDelegation(creditDelegationPlugin ? creditDelegationPlugin : null)

    const subgovernancePlugin = installedPlugins?.find(
      plugin => plugin.id === PLUGIN_IDS['maticmum'].subgovernance
    )
    setSubgovernace(subgovernancePlugin ? subgovernancePlugin : null)

    const uniswapv3Plugin = installedPlugins?.find(
      plugin => plugin.id === PLUGIN_IDS['maticmum'].uniswapV3
    )
    setUniswapV3(uniswapv3Plugin ? uniswapv3Plugin : null)

    const vaultPlugin = installedPlugins?.find(
      plugin => plugin.id === PLUGIN_IDS['maticmum'].vault
    )
    setVault(vaultPlugin ? vaultPlugin : null)

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
