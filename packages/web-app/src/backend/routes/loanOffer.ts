import axios from "axios";
import { MARKETPLACE_BACKEND_URL } from "utils/constants";

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
    const res = await axios.post(`${MARKETPLACE_BACKEND_URL}/`, loanOffer);
    return res.data;
};

export const getAllLoanOffers = async () => {
    const res = await axios.get(`${MARKETPLACE_BACKEND_URL}/loan-offer`);
    return res.data;
};

export const deleteLoanOffer = async (loanOfferId: string) => {
    const res = await axios.delete(`${MARKETPLACE_BACKEND_URL}/loan-offer/${loanOfferId}`);
    return res.data;
};
