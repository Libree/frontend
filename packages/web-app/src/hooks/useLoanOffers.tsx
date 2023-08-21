import { useEffect, useState } from 'react';

import { HookData, LoanOffer } from 'utils/types';
import { getAllLoanOffers } from 'backend/routes/loanOffer';

export function useLoanOffers(): HookData<LoanOffer[] | undefined> {
    const [data, setData] = useState<LoanOffer[]>();
    const [error, setError] = useState<Error>();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function getLoanOffers() {
            try {
                setIsLoading(true);

                const response = await getAllLoanOffers();
                if (response) setData(response as LoanOffer[]);
            } catch (err) {
                console.error(err);
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        }

        getLoanOffers();
    }, []);

    return { data, error, isLoading };
}
