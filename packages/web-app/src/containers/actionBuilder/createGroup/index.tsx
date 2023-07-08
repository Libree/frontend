import { ListItemAction } from '@aragon/ui-components';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { AccordionMethod } from 'components/accordionMethod';
import { ActionIndex } from 'utils/types';
import { FormItem } from '../addAddresses';
import { useAlertContext } from 'context/alert';
import ConfigureCreateGroupForm from 'containers/configureCreateGroup';

type CreateGroupActionProps = ActionIndex;

const CreateGroupAction: React.FC<CreateGroupActionProps> = ({
    actionIndex,
}) => {
    const { t } = useTranslation();
    const { setValue, clearErrors, resetField } = useFormContext();
    const { alert } = useAlertContext();

    const resetAddMemberFields = () => {
        clearErrors(`actions.${actionIndex}`);
        resetField(`actions.${actionIndex}`);
        setValue(`actions.${actionIndex}.inputs`, {
            groupName: '',
        });
        setValue('groupName', '');
        alert(t('alert.chip.resetAction'));
    };

    const methodActions = (() => {
        const result = [
            {
                component: <ListItemAction title={t('labels.resetAction')} bgWhite />,
                callback: resetAddMemberFields,
            },
        ];

        return result;
    })();

    return (
        <AccordionMethod
            verified
            type="action-builder"
            methodName={t('createGroup.nameInput')}
            dropdownItems={methodActions}
            methodDescription={t('createGroup.namePlaceholder')}
        >
            <FormItem className="py-3 space-y-3 rounded-b-xl">
                <ConfigureCreateGroupForm actionIndex={actionIndex} />
            </FormItem>
        </AccordionMethod>
    );
};

export default CreateGroupAction;
