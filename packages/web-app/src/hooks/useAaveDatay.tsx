import { useWallet } from 'hooks/useWallet';
import { useEffect, useState } from 'react';
import { IPool__factory } from 'typechain-types/IPool__factory';
import { CONTRACT_ADDRESSES } from 'utils/config';
import { ethers } from 'ethers';
import { MUMBAI_DECIMALS } from 'utils/constants';

interface IuseAaveData {
  totalCollateral: Number | null,
  totalDebt: Number | null,
  totalAvailableBorrow: Number | null,
  healthFactor: Number | null,
  currentLiquidationThreshold: Number | null,
  ltv: Number | null
}

export function useAaveData(daoAddress?: string): IuseAaveData {
  const { signer } = useWallet();

  const [totalCollateral, setTotalCollateral] = useState<Number | null>(null)
  const [totalDebt, setTotalDebt] = useState<Number | null>(null)
  const [totalAvailableBorrow, setTotalAvailableBorrow] = useState<Number | null>(null)
  const [currentLiquidationThreshold, setcurrentLiquidationThreshold] = useState<Number | null>(null)
  const [ltv, setLtv] = useState<Number | null>(null)
  const [healthFactor, setHealthFactor] = useState<Number | null>(null)


  useEffect(() => {
    if (signer && daoAddress) {
      getData(daoAddress, signer)
    }

  }, [signer, daoAddress])

  const getData = async (daoAddress: string, signer: any) => {
    const pool = IPool__factory.connect(CONTRACT_ADDRESSES['maticmum'].aavePool, signer);
    const data = await pool.getUserAccountData(daoAddress)
    setTotalAvailableBorrow(formatDecimals(data.availableBorrowsBase))
    setTotalCollateral(formatDecimals(data.totalCollateralBase))
    setTotalDebt(formatDecimals(data.totalDebtBase))
    setHealthFactor(formatDecimals(data.healthFactor))
    setcurrentLiquidationThreshold(formatDecimals(data.currentLiquidationThreshold))
    setLtv(formatDecimals(data.ltv))
  }

  const formatDecimals = (amount: ethers.BigNumber): Number => {
    return Number(amount) / Math.pow(10, MUMBAI_DECIMALS)
  }

  return {
    totalCollateral,
    totalDebt,
    totalAvailableBorrow,
    healthFactor,
    currentLiquidationThreshold,
    ltv
  };
}
