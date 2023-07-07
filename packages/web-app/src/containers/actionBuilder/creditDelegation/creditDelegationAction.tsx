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

    const resetCreditDelegationFields = () => {
        clearErrors(`actions.${actionIndex}`);
        resetField(`actions.${actionIndex}`);
        setValue(`actions.${actionIndex}`, {
            inputs: {
                user: '',
                token: '',
                amount: 0,
                interestRateType: '',
            },
            name: 'credit_delegation',
        });
        alert(t('alert.chip.resetAction'));
    };

    const removeCreditDelegationFields = (actionIndex: number) => {
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
                callback: resetCreditDelegationFields,
            },
        ];

        if (allowRemove) {
            result.push({
                component: (
                    <ListItemAction title={t('labels.removeEntireAction')} bgWhite />
                ),
                callback: () => {
                    removeCreditDelegationFields(actionIndex);
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
            methodName={t('TransferModal.creditDelegation')}
            dropdownItems={methodActions}
            methodDescription={t('TransferModal.creditSubtitle')}
        >
            <FormItem className="py-3 space-y-3 rounded-b-xl">
                <ConfigureCreditDelegationForm actionIndex={actionIndex} />
            </FormItem>
        </AccordionMethod>
    );
};

export default CreditDelegationAction;
