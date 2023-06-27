import { clientPlugin } from 'context/apolloClient';
import {
  SupportedNetworks,
} from 'utils/constants';
import { PLUGIN_DATA_QUERY } from 'queries/aragon/plugins';
import { InstalledPluginListItem } from '@aragon/sdk-client';

async function fetchDaoPlugins(
  address: string,
  network: SupportedNetworks,
): Promise<InstalledPluginListItem[] | undefined> {

  const response = await clientPlugin[network]?.query(
    {
      query: PLUGIN_DATA_QUERY,
      variables: { address },
    }
  )

  if (response && !response.error && response.data.dao) {
    return response.data.dao.plugins.map((plugin: any) => ({
      id: plugin.appliedPluginRepo.subdomain,
      instanceAddress: plugin.appliedPreparation.pluginAddress,
      release: plugin.appliedVersion.release.release,
      build: plugin.appliedVersion.build,
    }))
  }


  console.error('Error fetching token data', response?.error);

}

export { fetchDaoPlugins };
