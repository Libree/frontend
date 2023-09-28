import { useWallet } from 'hooks/useWallet';
import { useEffect, useState } from 'react';
import { pwnSimpleLoanAddress, pwnSimpleLoanOfferAddress } from 'utils/config';
import { useDaoDetailsQuery } from './useDaoDetails';
import { useInstalledPlugins } from './useInstalledPlugins';
import { Pwn__factory } from 'typechain-types/Pwn__factory';
import { Pwn } from 'typechain-types/Pwn';
import { IPWNSimpleLoan } from 'typechain-types/IPWNSimpleLoan';
import { IPWNSimpleLoan__factory } from 'typechain-types/IPWNSimpleLoan__factory';
import { IPWNSimpleLoanListOffer } from 'typechain-types/IPWNSimpleLoanListOffer';
import { IPWNSimpleLoanListOffer__factory } from 'typechain-types/IPWNSimpleLoanListOffer__factory';
import type { ContractTransaction } from "ethers";
import { ethers } from "ethers";

interface IusePWN {
  createLoan: (offer: any) => Promise<ContractTransaction | undefined>
}

export function usePWN(): IusePWN {
  const { signer } = useWallet();
  const { data: daoDetails } = useDaoDetailsQuery()
  const { pwn } = useInstalledPlugins(daoDetails?.address);

  const [pwnPlugin, setPwnPlugin] = useState<Pwn | null>(null)


  useEffect(() => {
    if (signer && daoDetails && pwn) {
      const factoryPlugin = new Pwn__factory().connect(signer);
      setPwnPlugin(factoryPlugin.attach(pwn.instanceAddress));
    }

  }, [signer, daoDetails, pwn])

  const createLoan = async (offer: any): Promise<ContractTransaction | undefined> => {
    if (signer) {

      const pwnSimpleLoanList = new ethers.Contract(
        pwnSimpleLoanOfferAddress,
        IPWNSimpleLoanListOffer__factory.abi,
        signer) as IPWNSimpleLoanListOffer;

      const simpleLoan = new ethers.Contract(
        pwnSimpleLoanAddress,
        IPWNSimpleLoan__factory.abi,
        signer) as IPWNSimpleLoan;

      delete offer.id;
      offer.collateralId = 0;

      const offerHash = await pwnSimpleLoanList.getOfferHash(offer)
      const signature = await signer?.signMessage(offerHash || "")
      const factoryData = await pwnSimpleLoanList?.encodeLoanTermsFactoryData(offer)

      return simpleLoan?.createLOAN(
        pwnSimpleLoanOfferAddress,
        factoryData || "",
        signature || "",
        [],
        []
      )


    }
  }

  return {
    createLoan
  };
}
