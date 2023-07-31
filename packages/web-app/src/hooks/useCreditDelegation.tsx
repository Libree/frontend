import { useInstalledPlugins } from './useInstalledPlugins';
import { useWallet } from 'hooks/useWallet';
import { useEffect, useState } from 'react';
import { CreditDelegator__factory } from 'typechain-types/CreditDelegator__factory';
import { CreditDelegator } from 'typechain-types/CreditDelegator';
import { ethers } from 'ethers'
import { erc20TokenABI } from 'abis/erc20TokenABI';

export function useCreditDelegation(daoAddress?: string): any {
  const { creditDelegation } = useInstalledPlugins(daoAddress);
  const { signer } = useWallet();

  const [delegationPlugin, setDelegationPlugin] = useState<CreditDelegator | null>(null)

  useEffect(() => {

    if (signer && creditDelegation) {
      const factory = new CreditDelegator__factory().connect(signer);
      setDelegationPlugin(factory.attach(creditDelegation.instanceAddress));
    }

  }, [signer, creditDelegation]);

  const deposit = (asset: string, amount: string) => {
    return delegationPlugin?.supply(asset, amount)
  }

  const tokenAllowance = async (asset: string) => {
    if (signer) {
      {
        const contract = new ethers.Contract(asset, erc20TokenABI, signer);
        try {
          const userAddress = await signer.getAddress()
          const allowance = Number(await contract.allowance(userAddress, creditDelegation?.instanceAddress))
          return allowance
        } catch (err) {
          return 0;
        }
      }
    }
  }

  const approve = async (asset: string, amount: string) => {
    if (signer) {
      {
        const contract = new ethers.Contract(asset, erc20TokenABI, signer);
        try {
          return contract.approve(creditDelegation?.instanceAddress, amount)
        } catch (err) {
          return err;
        }
      }
    }
  }


  return {
    deposit,
    tokenAllowance,
    approve
  };
}
