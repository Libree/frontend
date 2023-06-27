import React from 'react';
import {CardToken} from '@aragon/ui-components';
import {formatUnits} from 'ethers/lib/utils';
import {useTranslation} from 'react-i18next';

import {abbreviateTokenAmount} from 'utils/tokens';

type GroupListProps = {
    groups: any[];
};

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const GroupList: React.FC<GroupListProps> = ({groups}) => {
  const {t} = useTranslation();

  if (groups.length === 0)
    return <p data-testid="groupList">{t('allTokens.noTokens')}</p>;

  return (
    <div className="space-y-1.5" data-testid="groupList">
      {groups.map(groupData => (
        <CardToken
          key={groupData.metadata.id}
          tokenName={groupData.metadata.name}
          tokenSymbol={groupData.metadata.symbol}
          tokenImageUrl={groupData.metadata.imgUrl || ''}
          tokenCount={abbreviateTokenAmount(
            formatUnits(groupData.balance, groupData.metadata.decimals)
          )}
          {...(!groupData.marketData
            ? {
                tokenUSDValue: t('finance.unknownUSDValue'),
                treasuryShare: t('finance.unknownUSDValue'),
              }
            : {
                tokenUSDValue: usdFormatter.format(groupData.marketData.price),
                treasuryShare: usdFormatter.format(
                  groupData.marketData.balanceValue
                ),
                treasurySharePercentage: `${groupData.treasurySharePercentage?.toFixed(
                  0
                )}%`,

                // Type of change during interval
                changeType:
                  groupData.marketData.percentageChangedDuringInterval > 0
                    ? 'Positive'
                    : 'Negative',

                // Percentage change during given interval
                percentageChangeDuringInterval:
                  new Intl.NumberFormat('en-US', {
                    signDisplay: 'always',
                    maximumFractionDigits: 2,
                  }).format(groupData.marketData.percentageChangedDuringInterval) +
                  '%',

                // Change during interval in currency
                changeDuringInterval: new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  signDisplay: 'always',
                }).format(groupData.marketData.valueChangeDuringInterval!),
              })}
        />
      ))}
    </div>
  );
};

export default GroupList;
