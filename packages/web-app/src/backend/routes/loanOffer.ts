import {MARKETPLACE_BACKEND_URL} from 'utils/constants';

type LoanOfferData = {
  collateralCategory: number;
  collateralAddress: string;
  collateralId: number;
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

export const postLoanOffer = async (loanOffer: LoanOfferData) => {
  const res = await fetch(`${MARKETPLACE_BACKEND_URL}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loanOffer),
  });
  return res.json();
};

export const getAllLoanOffers = async () => {
  const res = await fetch(`${MARKETPLACE_BACKEND_URL}/loan-offer`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
};

export const deleteLoanOffer = async (loanOfferId: string) => {
  const res = await fetch(
    `${MARKETPLACE_BACKEND_URL}/loan-offer/${loanOfferId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return res.json();
};
