import { useInstalledPlugins } from './useInstalledPlugins';
import { useWallet } from 'hooks/useWallet';
import { useEffect, useState } from 'react';
import { CreditDelegator__factory } from 'typechain-types/CreditDelegator__factory';
import { CreditDelegator } from 'typechain-types/CreditDelegator';

export function useCreditDelegation(daoAddress?: string): any {
  const { creditDelegation } = useInstalledPlugins(daoAddress)
  const { signer } = useWallet();

  const [delegationPlugin, setDelegationPlugin] = useState<CreditDelegator | null>(null)

  useEffect(() => {

    if (signer && creditDelegation) {
      const factory = new CreditDelegator__factory().connect(signer);
      setDelegationPlugin(factory.attach(creditDelegation.instanceAddress));
    }

  }, [signer, creditDelegation])

  const deposit = (asset: string, amount: string) => {
    return delegationPlugin?.supply(asset, amount)
  }


  return {
    deposit
  };
}
