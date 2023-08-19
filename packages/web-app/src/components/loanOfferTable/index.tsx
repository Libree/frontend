import React from 'react';

export const LoanOfferTable: React.FC = () => {
    return (
        <>
            <div className='w-full'>
                <table className='w-full'>
                    <thead>
                        <tr>
                            <th>Opportunity Type</th>
                            <th>Collateral</th>
                            <th>Duration</th>
                            <th>APY</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Token backed</td>
                            <td>ETH</td>
                            <td>30 Days</td>
                            <td>5%</td>
                            <td>1000 USDC</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
};
