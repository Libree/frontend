import React from 'react';
import { useTranslation } from 'react-i18next';

import { CardGroup } from 'components/groupCard';

type GroupListProps = {
  groups: any[];
};

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const GroupList: React.FC<GroupListProps> = ({ groups }) => {
  const { t } = useTranslation();

  if (groups.length === 0)
    return <p data-testid="groupList">{t('community.groups.noGroupsData')}</p>;

  return (
    <div className="space-y-1.5" data-testid="groupList">
      {groups.map(groupData => (
        <CardGroup
          key={groupData.id}
          groupId={groupData.id}
          groupName={groupData.name}
          groupDescription={groupData.description}
          groupImageUrl={groupData.imgUrl || ''}
          memberCount={groupData.memberCount}
          groupUSDValue={usdFormatter.format(groupData.value)}
        />
      ))}
    </div>
  );
};

export default GroupList;
