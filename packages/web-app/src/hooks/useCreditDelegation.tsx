import { useInstalledPlugins } from './useInstalledPlugins';
import { useWallet } from 'hooks/useWallet';
import { useEffect, useState } from 'react';
import { CreditDelegator__factory } from 'typechain-types/CreditDelegator__factory';
import { CreditDelegator } from 'typechain-types/CreditDelegator';
import { DAO } from 'typechain-types/DAO';
import { DAO__factory } from 'typechain-types/DAO__factory';
import { ethers } from 'ethers'
import { erc20TokenABI } from 'abis/erc20TokenABI';

export function useCreditDelegation(daoAddress?: string): any {
  const { creditDelegation } = useInstalledPlugins(daoAddress);
  const { signer } = useWallet();

  const [delegationPlugin, setDelegationPlugin] = useState<CreditDelegator | null>(null)
  const [daoContract, setDaoContract] = useState<DAO | null>(null)

  useEffect(() => {

    if (signer && creditDelegation) {
      const factory = new CreditDelegator__factory().connect(signer);
      setDelegationPlugin(factory.attach(creditDelegation.instanceAddress));
    }

    if (signer && daoAddress) {
      const daofactory = new DAO__factory().connect(signer);
      setDaoContract(daofactory.attach(daoAddress));
    }

  }, [signer, creditDelegation, daoAddress]);

  const depositOnAave = (asset: string, amount: string) => {
    return delegationPlugin?.supply(asset, amount)
  }

  const depositIntoDAO = (asset: string, amount: string) => {
    return daoContract?.deposit(asset, amount, "")
  }

  const tokenAllowanceAave = async (asset: string) => {
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

  const tokenAllowanceDAO = async (asset: string) => {
    if (signer) {
      {
        const contract = new ethers.Contract(asset, erc20TokenABI, signer);
        try {
          const userAddress = await signer.getAddress()
          const allowance = Number(await contract.allowance(userAddress, daoAddress))
          return allowance
        } catch (err) {
          return 0;
        }
      }
    }
  }

  const approveAave = async (asset: string, amount: string) => {
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

  const approveDAO = async (asset: string, amount: string) => {
    if (signer) {
      {
        const contract = new ethers.Contract(asset, erc20TokenABI, signer);
        try {
          return contract.approve(daoAddress, amount)
        } catch (err) {
          return err;
        }
      }
    }
  }


  return {
    depositOnAave,
    tokenAllowanceAave,
    tokenAllowanceDAO,
    approveAave,
    approveDAO,
    depositIntoDAO
  };
}
