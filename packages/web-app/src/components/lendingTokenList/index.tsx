import React from 'react';
import { useTranslation } from 'react-i18next';

import { LendingCardToken } from 'components/lendingCardToken';

type LendingTokenListProps = {
    tokens: any[];
};

const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

const LendingTokenList: React.FC<LendingTokenListProps> = ({ tokens }) => {
    const { t } = useTranslation();

    if (tokens.length === 0)
        return <p data-testid="tokenList">{t('allTokens.noTokens')}</p>;

    return (
        <div className="space-y-1.5" data-testid="tokenList">
            {tokens.map(token => (
                <LendingCardToken
                    key={token.id}
                    tokenSymbol={token.symbol}
                    tokenAPY={token.apyPercentage}
                    tokenImageUrl={token.imgUrl || ''}
                    tokenBalance={token.balance}
                    tokenUSDValue={usdFormatter.format(token.balanceUsd)}
                    changeType={token.changeType}
                />
            ))}
        </div>
    );
};

export default LendingTokenList;
