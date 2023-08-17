import {Erc20TokenDetails, TokenVotingMember} from '@aragon/sdk-client';
import {QueryClient} from '@tanstack/react-query';
import {useNetwork} from 'context/network';
import {useSpecificProvider} from 'context/providers';
import {useEffect, useState} from 'react';
import {CHAIN_METADATA} from 'utils/constants';
import {fetchBalance} from 'utils/tokens';

import {HookData} from 'utils/types';
import {useDaoToken} from './useDaoToken';
import {PluginTypes, usePluginClient} from './usePluginClient';
import {TokenHoldersResponse, getTokenHoldersPaged} from 'services/covalentAPI';
import {formatUnits} from 'ethers/lib/utils';
import {useWallet} from './useWallet';

export type MultisigMember = {
  address: string;
};

export type BalanceMember = MultisigMember & {
  balance: number;
};

export type DaoMembers = {
  members: MultisigMember[] | BalanceMember[];
  filteredMembers: MultisigMember[] | BalanceMember[];
  daoToken?: Erc20TokenDetails;
};

// this type guard will need to evolve when there are more types
export function isMultisigMember(
  member: BalanceMember | MultisigMember
): member is MultisigMember {
  return !('address' in member);
}

export function isBalanceMember(
  member: BalanceMember | MultisigMember
): member is BalanceMember {
  return 'balance' in member;
}

/**
 * Hook to fetch DAO members. Fetches token if DAO is token based, and allows
 * for a search term to be passed in to filter the members list. NOTE: the
 * totalMembers included in the response is the total number of members in the
 * DAO, and not the number of members returned when filtering by search term.
 *
 * @param pluginAddress plugin from which members will be retrieved
 * @param pluginType plugin type
 * @param searchTerm Optional member search term  (e.g. '0x...')
 * @returns A list of DAO members, the total number of members in the DAO and
 * the DAO token (if token-based)
 */
export const useDaoMembers = (
  pluginAddress: string,
  pluginType?: PluginTypes,
  searchTerm?: string
): HookData<DaoMembers> => {
  const [data, setData] = useState<BalanceMember[] | MultisigMember[]>([]);
  const [rawMembers, setRawMembers] = useState<
    TokenVotingMember[] | string[]
  >();
  const [filteredData, setFilteredData] = useState<
    BalanceMember[] | MultisigMember[]
  >([]);
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);

  const {network} = useNetwork();
  const provider = useSpecificProvider(CHAIN_METADATA[network].id);

  const isTokenBased = pluginType === 'token-voting.plugin.dao.eth';
  const {data: daoToken} = useDaoToken(pluginAddress);

  const client = usePluginClient(pluginType);

  const {address} = useWallet();

  // Fetch the list of members for a this DAO.
  useEffect(() => {
    async function fetchMembers() {
      try {
        if (!pluginType) {
          setData([]);
          return;
        }

        if (pluginType === 'multisig.plugin.dao.eth' || network === 'goerli') {
          setIsLoading(true);

          const response = await client?.methods.getMembers(pluginAddress);

          if (!response) {
            setData([]);
            return;
          }

          if (!response.length && daoToken && address) {
            const balance = await fetchBalance(
              daoToken?.address,
              address,
              provider,
              CHAIN_METADATA[network].nativeCurrency,
              false
            );

            const balanceNumber = Number(
              formatUnits(balance, daoToken.decimals)
            );

            if (balanceNumber > 0) {
              (response as TokenVotingMember[]).push({
                address,
                balance: balance.toBigInt(),
                delegatee: null,
                delegators: [],
                votingPower: balance.toBigInt(),
              } as TokenVotingMember);
            }
          }

          setRawMembers(response);
        } else {
          const queryClient = new QueryClient();

          if (!daoToken) {
            setData([] as BalanceMember[] | MultisigMember[]);
            return;
          }

          //TODO: pagination should be added later here
          const rawMembers: TokenHoldersResponse = await getTokenHoldersPaged(
            queryClient,
            daoToken?.address,
            network,
            0,
            100
          );

          const members = rawMembers.data.items.map(m => {
            return {
              address: m.address,
              balance: Number(formatUnits(m.balance, m.contract_decimals)),
            } as BalanceMember;
          });

          members.sort(sortMembers);
          setData(members);
        }
        setIsLoading(false);
        setError(undefined);
      } catch (err) {
        console.error(err);
        setError(err as Error);
      }
    }

    fetchMembers();
  }, [
    address,
    client?.methods,
    daoToken,
    daoToken?.address,
    network,
    pluginAddress,
    pluginType,
    provider,
  ]);

  // map the members to the desired structure
  // Doing this separately to get rid of duplicate calls
  // when raw members present, but no token details yet
  useEffect(() => {
    async function mapMembers() {
      if (!rawMembers || (isTokenBased && !daoToken?.address)) return;

      let members;

      //TODO: A general type guard should be added later
      if (isTokenBased && daoToken?.address) {
        const balances = await Promise.all(
          rawMembers.map(m => {
            if ((m as TokenVotingMember)?.address)
              return fetchBalance(
                daoToken.address,
                (m as TokenVotingMember).address,
                provider,
                CHAIN_METADATA[network].nativeCurrency
              );
          })
        );

        members = rawMembers.map(
          (m, index) =>
            ({
              address: (m as TokenVotingMember).address,
              balance: Number(balances[index]),
            } as BalanceMember)
        );
      } else {
        members = rawMembers.map(m => ({address: m} as MultisigMember));
      }

      members.sort(sortMembers);
      setData(members);
    }

    mapMembers();
  }, [daoToken?.address, isTokenBased, network, provider, rawMembers]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredData([]);
    } else {
      isTokenBased
        ? setFilteredData(
            (data as BalanceMember[]).filter(d =>
              d.address.toLowerCase().includes(searchTerm.toLowerCase())
            )
          )
        : setFilteredData(
            (data as MultisigMember[]).filter(d =>
              d.address.toLowerCase().includes(searchTerm.toLowerCase())
            )
          );
    }
  }, [data, isTokenBased, searchTerm]);

  return {
    data: {
      members: data,
      filteredMembers: filteredData,
      daoToken,
    },
    isLoading,
    error,
  };
};

function sortMembers<T extends BalanceMember | MultisigMember>(a: T, b: T) {
  if (isBalanceMember(a)) {
    if (a.balance === (b as BalanceMember).balance) return 0;
    return a.balance > (b as BalanceMember).balance ? -1 : 1;
  } else {
    if (a.address === (b as MultisigMember).address) return 0;
    return a.address > (b as MultisigMember).address ? 1 : -1;
  }
}
