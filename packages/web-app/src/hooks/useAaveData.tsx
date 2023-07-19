import { useWallet } from 'hooks/useWallet';
import { useEffect, useState } from 'react';
import { IPool__factory } from 'typechain-types/IPool__factory';
import { CONTRACT_ADDRESSES } from 'utils/config';
import { ethers } from 'ethers';
import { MUMBAI_DECIMALS } from 'utils/constants';
import { useDaoVault } from './useDaoVault';
import { aTokenABI } from 'abis/erc20TokenABI';
import { VaultToken } from 'utils/types';
import { useDaoDetailsQuery } from './useDaoDetails';

interface IuseAaveData {
  totalCollateral: Number | null,
  totalDebt: Number | null,
  totalAvailableBorrow: Number | null,
  healthFactor: Number | null,
  currentLiquidationThreshold: Number | null,
  ltv: Number | null,
  netWorth: number,
  reserves: IReserves[]
}

export type IReserves = VaultToken & {
  currentLiquidityRate: number;
  currentStableBorrowRate: number;
  currentVariableBorrowRate: number
};

export function useAaveData(): IuseAaveData {
  const { signer } = useWallet();
  const { tokens } = useDaoVault()
  const { data: daoDetails } = useDaoDetailsQuery()
  const [totalCollateral, setTotalCollateral] = useState<Number | null>(null)
  const [netWorth, setNetWorth] = useState<number>(0)
  const [totalDebt, setTotalDebt] = useState<Number | null>(null)
  const [totalAvailableBorrow, setTotalAvailableBorrow] = useState<Number | null>(null)
  const [currentLiquidationThreshold, setcurrentLiquidationThreshold] = useState<Number | null>(null)
  const [ltv, setLtv] = useState<Number | null>(null)
  const [healthFactor, setHealthFactor] = useState<Number | null>(null)
  const [reserves, setReserves] = useState<IReserves[]>([])


  useEffect(() => {
    if (signer && daoDetails && tokens) {
      getData(daoDetails.address, signer)
    }

  }, [signer, daoDetails, tokens])

  const getData = async (daoAddress: string, signer: any) => {
    const pool = IPool__factory.connect(CONTRACT_ADDRESSES['maticmum'].aavePool, signer);
    const data = await pool.getUserAccountData(daoAddress)
    setTotalAvailableBorrow(formatDecimals(data.availableBorrowsBase))
    setHealthFactor(formatDecimals(data.healthFactor))
    setcurrentLiquidationThreshold(formatDecimals(data.currentLiquidationThreshold))
    setLtv(formatDecimals(data.ltv))

    const aaveTokens = tokens.filter(token => token.metadata.name.includes('Aave'))

    const totalCollateral = aaveTokens
      .filter(token => !token.metadata.name.includes('Debt'))
      .reduce((total, token) => {
        return total + (token.marketData?.balanceValue || 0);
      }, 0);

    const totalDebt = aaveTokens
      .filter(token => token.metadata.name.includes('Debt'))
      .reduce((total, token) => {
        return total + (token.marketData?.balanceValue || 0);
      }, 0);

    setTotalCollateral(totalCollateral)
    setTotalDebt(totalDebt)
    setNetWorth(totalCollateral - totalDebt)

    let reserveData: IReserves[] = []

    for (let i = 0; i < aaveTokens.length; i++) {
      const aToken = new ethers.Contract(
        aaveTokens[i].metadata.id,
        aTokenABI,
        signer
      );

      const underlyingAsset = await aToken.UNDERLYING_ASSET_ADDRESS()
      const data = await pool.getReserveData(underlyingAsset)
      reserveData.push(
        {...aaveTokens[i],
          currentLiquidityRate: formatRates(data['currentLiquidityRate']),
          currentStableBorrowRate: formatRates(data['currentStableBorrowRate']),
          currentVariableBorrowRate: formatRates(data['currentVariableBorrowRate'])
        }
      )
    }

    setReserves(reserveData)
  }

  const formatDecimals = (amount: ethers.BigNumber): Number => {
    return Number(amount) / Math.pow(10, MUMBAI_DECIMALS)
  }

  const formatRates = (amount: ethers.BigNumber): number => {
    return Number(amount) / Math.pow(10, 25)
  }

  return {
    netWorth,
    totalCollateral,
    totalDebt,
    totalAvailableBorrow,
    healthFactor,
    currentLiquidationThreshold,
    ltv,
    reserves
  };
}
