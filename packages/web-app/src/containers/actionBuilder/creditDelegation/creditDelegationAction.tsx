import { ListItemAction } from '@aragon/ui-components';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { AccordionMethod } from 'components/accordionMethod';
import { useActionsContext } from 'context/actions';
import { ActionIndex } from 'utils/types';
import { FormItem } from '../addAddresses';
import { useAlertContext } from 'context/alert';
import ConfigureCreditDelegationForm from 'containers/configureCreditDelegation';

type CreditDelegationActionProps = ActionIndex & { allowRemove?: boolean };

const CreditDelegationAction: React.FC<CreditDelegationActionProps> = ({
    actionIndex,
    allowRemove = true,
}) => {
    const { t } = useTranslation();
    const { removeAction, duplicateAction } = useActionsContext();
    const { setValue, clearErrors, resetField } = useFormContext();
    const { alert } = useAlertContext();

    const resetAddMemberFields = () => {
        clearErrors(`actions.${actionIndex}`);
        resetField(`actions.${actionIndex}`);
        setValue(`actions.${actionIndex}`, {
            address: '',
        });
        alert(t('alert.chip.resetAction'));
    };

    const removeAddMemberFields = (actionIndex: number) => {
        removeAction(actionIndex);
    };

    const methodActions = (() => {
        const result = [
            {
                component: (
                    <ListItemAction title={t('labels.duplicateAction')} bgWhite />
                ),
                callback: () => {
                    duplicateAction(actionIndex);
                    alert(t('alert.chip.duplicateAction'));
                },
            },
            {
                component: <ListItemAction title={t('labels.resetAction')} bgWhite />,
                callback: resetAddMemberFields,
            },
        ];

        if (allowRemove) {
            result.push({
                component: (
                    <ListItemAction title={t('labels.removeEntireAction')} bgWhite />
                ),
                callback: () => {
                    removeAddMemberFields(actionIndex);
                    alert(t('alert.chip.removedAction'));
                },
            });
        }

        return result;
    })();

    return (
        <AccordionMethod
            verified
            type="action-builder"
            methodName={t('labels.addMember')}
            dropdownItems={methodActions}
            methodDescription={t('addMember.subtitle')}
        >
            <FormItem className="py-3 space-y-3 rounded-b-xl">
                <ConfigureCreditDelegationForm actionIndex={actionIndex} />
            </FormItem>
        </AccordionMethod>
    );
};

export default CreditDelegationAction;
