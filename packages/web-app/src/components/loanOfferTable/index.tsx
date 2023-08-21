import React from 'react';
import { getTokenLogo, getTokenSymbol } from 'utils/library';
import useScreen from 'hooks/useScreen';

type LoanOffer = {
    id: number;
    collateralCategory: number;
    collateralAddress: string;
    collateralAmount: number;
    loanAssetAddress: string;
    loanAmount: number;
    loanYield: number;
    duration: number;
    expiration: number;
    borrower: string;
    lender: string;
    isPersistent: boolean;
    nonce: string;
};

type LoanOfferTableProps = {
    loanOffers: LoanOffer[];
};

export const LoanOfferTable: React.FC<LoanOfferTableProps> = ({
    loanOffers,
}) => {
    const { isMobile } = useScreen();
    return (
        <>
            <div className='text-ui-800 my-1 overflow-x-auto'>
                <table className='w-full'>
                    <thead>
                        <tr className='text-left text-sm tablet:text-base'>
                            <th className='font-bold px-2'>Opportunity Type</th>
                            <th className='font-bold px-2'>Collateral</th>
                            <th className='font-bold px-2'>Duration</th>
                            <th className='font-bold px-2'>APY</th>
                            <th className='font-bold px-2'>Amount</th>
                        </tr>
                    </thead>
                    <tbody className='text-ui-500 my-1'>
                        {loanOffers.map((loanOffer) => (
                            <tr
                                key={loanOffer.id}
                                className='text-sm tablet:text-base'
                            >
                                <td className='py-1 font-semibold'>
                                    <div className='w-full h-full p-1.5 tablet:p-2 bg-white rounded-l-2xl'>
                                        <p className='font-semibold'>
                                            {loanOffer.collateralCategory === 0 ? 'ERC20' : 'ERC721'}
                                        </p>
                                    </div>
                                </td>
                                <td className='py-1 font-semibold'>
                                    <div className='p-1.5 tablet:p-2 bg-white'>
                                        <p className='font-semibold'>
                                            {getTokenSymbol(loanOffer.collateralAddress)}
                                        </p>
                                    </div>
                                </td>
                                <td className='py-1 font-semibold'>
                                    <div className='p-1.5 tablet:p-2 bg-white'>
                                        <p className='font-semibold'>
                                            {`${loanOffer.duration} Days`}
                                        </p>
                                    </div>
                                </td>
                                <td className='py-1 font-semibold'>
                                    <div className='p-1.5 tablet:p-2 bg-white'>
                                        <p className='font-semibold'>
                                            {`${loanOffer.loanYield}%`}
                                        </p>
                                    </div>
                                </td>
                                <td className='py-1 rounded-r-2xl font-semibold'>
                                    <div className='p-1.5 tablet:p-2 bg-white rounded-r-2xl'>
                                        <p className='font-semibold'>
                                            {`${loanOffer.loanAmount} ${isMobile ? '' : getTokenSymbol(loanOffer.loanAssetAddress)}`}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
};
