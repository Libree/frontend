import {useEffect, useMemo, useState} from 'react';
import {alchemyApiKeys, CHAIN_METADATA} from 'utils/constants';

import {HookData} from 'utils/types';
import {useSpecificProvider} from 'context/providers';
import {useNetwork} from 'context/network';

export const useDaoNFTs = (
  daoAddress?: string
): HookData<Array<any> | undefined> => {
  const {network} = useNetwork();

  const [data, setData] = useState<Array<any>>([]);
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);

  const provider = useSpecificProvider(CHAIN_METADATA[network].id);

  // Construct the Alchemy API URL
  const url = `${CHAIN_METADATA[network].alchemyApiNFT}/${alchemyApiKeys[network]}/getNFTs`;

  // Memoize the options object to prevent unnecessary re-renders
  const request = useMemo(
    () => ({
      method: 'GET',
      url: `${url}?owner=${daoAddress}`
    }),
    [daoAddress]
  );

  // Use the useEffect hook to fetch DAO balances
  useEffect(() => {
    async function getNFTBalances() {
      try {
        setIsLoading(true);

        const res = await fetch(request.url, {method: request.method});
        const tokenList = await res.json();

        setData(tokenList.ownedNfts)

      } catch (error) {
        console.error(error);
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    }

    if (daoAddress) getNFTBalances();
  }, [daoAddress, network, request, provider, url]);

  return {data, error, isLoading};
};
