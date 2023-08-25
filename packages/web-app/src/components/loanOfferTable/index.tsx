import React from 'react';
import { getTokenIcon, getTokenSymbol } from 'utils/library';
import useScreen from 'hooks/useScreen';
import { LoanOffer } from 'utils/types';
import { useTranslation } from 'react-i18next';
import { IconSolidCart } from '@aragon/ui-components/src/components/icons';
import { usePWN } from 'hooks/usePWN';

type LoanOfferTableProps = {
    loanOffers: LoanOffer[];
};




export const LoanOfferTable: React.FC<LoanOfferTableProps> = ({
    loanOffers,
}) => {

    const { createLoan } = usePWN()

    const handleBuy = async (e: any) => {
        const tx = await createLoan(loanOffers[Number(e.currentTarget.id)])
        await tx?.wait()
    }


    const { t } = useTranslation()
    const { isMobile } = useScreen();
    return (
        <>
            <div className='text-ui-800 my-1 overflow-x-auto'>
                <table className='w-full'>
                    <thead>
                        <tr className='text-left text-sm tablet:text-base'>
                            <th className='font-bold px-2'>{t('marketplace.loanOffersTable.header1')}</th>
                            <th className='font-bold px-2'>{t('marketplace.loanOffersTable.header2')}</th>
                            <th className='font-bold px-2'>
                                {t('marketplace.loanOffersTable.header3')}
                                &nbsp;
                                {isMobile && (
                                    <span className='font-bold text-xs'>{t('marketplace.loanOffersTable.inDays')}</span>
                                )}
                            </th>
                            <th className='font-bold px-2'>{t('marketplace.loanOffersTable.header4')}</th>
                            <th className='font-bold px-2'>{t('marketplace.loanOffersTable.header5')}</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody className='text-ui-500 my-1'>
                        {loanOffers.map((loanOffer, index) => {
                            const loanAssetIcon = getTokenIcon(loanOffer.loanAssetAddress);
                            return (
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
                                                {getTokenSymbol(loanOffer.collateralAddress) || <span className='invisible'>{'N/A'}</span>}
                                            </p>
                                        </div>
                                    </td>
                                    <td className='py-1 font-semibold'>
                                        <div className='p-1.5 tablet:p-2 bg-white'>
                                            <p className='font-semibold'>
                                                {`${loanOffer.duration} ${isMobile ? '' : 'Days'}`}
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
                                    <td className='py-1 font-semibold'>
                                        <div className='flex items-center p-1.5 tablet:p-2 space-x-0.5 tablet:space-x-1 bg-white'>
                                            <img src={loanAssetIcon} alt='' width={20} height={20} />
                                            <p className='font-semibold'>
                                                {`${loanOffer.loanAmount} ${isMobile ? '' : getTokenSymbol(loanOffer.loanAssetAddress)}`}
                                            </p>
                                        </div>
                                    </td>
                                    <td className='py-1 rounded-r-2xl'>
                                        <div className='p-1.5 tablet:p-2 bg-white rounded-r-2xl' onClick={handleBuy} id={index.toString()}>
                                            <IconSolidCart height={isMobile ? 20 : 24} width={isMobile ? 20 : 24} />
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
};
