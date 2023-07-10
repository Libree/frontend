import { CardText, ListItemAddress } from '@aragon/ui-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { AccordionMethod } from 'components/accordionMethod';
import { ActionCreateGroup } from 'utils/types';

export const CreateGroupCard: React.FC<{
    action: ActionCreateGroup;
}> = ({ action }) => {
    const { t } = useTranslation();
    const { groupName } = action.inputs;

    return (
        <AccordionMethod
            type="execution-widget"
            methodName={t('createGroup.title')}
            smartContractName={t('labels.aragonOSx')}
            verified
            methodDescription={t('createGroup.description')}
        >
            <Container>
                <CardText
                    type='title'
                    title={t('createGroup.nameInput')}
                    content={groupName}
                />
            </Container>
        </AccordionMethod>
    );
};

const Container = styled.div.attrs({
    className: 'bg-ui-50 border border-t-0 border-ui-100 space-y-1 p-2',
})``;
