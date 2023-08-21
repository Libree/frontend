import React from 'react';

export const LoanOfferTable: React.FC = () => {
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
                        <tr className='text-sm tablet:text-base'>
                            <td className='py-1 font-semibold'>
                                <div className='w-full h-full p-2 bg-white rounded-l-2xl'>
                                    <p className='font-semibold'>
                                        Token backed
                                    </p>
                                </div>
                            </td>
                            <td className='py-1 font-semibold'>
                                <div className='p-2 bg-white'>
                                    <p className='font-semibold'>ETH</p>
                                </div>
                            </td>
                            <td className='py-1 font-semibold'>
                                <div className='p-2 bg-white'>
                                    <p className='font-semibold'>30 Days</p>
                                </div>
                            </td>
                            <td className='py-1 font-semibold'>
                                <div className='p-2 bg-white'>
                                    <p className='font-semibold'>5%</p>
                                </div>
                            </td>
                            <td className='py-1 rounded-r-2xl font-semibold'>
                                <div className='p-2 bg-white rounded-r-2xl'>
                                    <p className='font-semibold'>1000 USDC</p>
                                </div>
                            </td>
                        </tr>
                        <tr className='text-sm tablet:text-base'>
                            <td className='py-1 font-semibold'>
                                <div className='w-full h-full p-2 bg-white rounded-l-2xl'>
                                    <p className='font-semibold'>
                                        Token backed
                                    </p>
                                </div>
                            </td>
                            <td className='py-1 font-semibold'>
                                <div className='p-2 bg-white'>
                                    <p className='font-semibold'>ETH</p>
                                </div>
                            </td>
                            <td className='py-1 font-semibold'>
                                <div className='p-2 bg-white'>
                                    <p className='font-semibold'>30 Days</p>
                                </div>
                            </td>
                            <td className='py-1 font-semibold'>
                                <div className='p-2 bg-white'>
                                    <p className='font-semibold'>5%</p>
                                </div>
                            </td>
                            <td className='py-1 rounded-r-2xl font-semibold'>
                                <div className='p-2 bg-white rounded-r-2xl'>
                                    <p className='font-semibold'>1000 USDC</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
};
