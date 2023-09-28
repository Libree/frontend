import { ListItemAction } from '@aragon/ui-components';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { AccordionMethod } from 'components/accordionMethod';
import { useActionsContext } from 'context/actions';
import { ActionIndex } from 'utils/types';
import { FormItem } from '../addAddresses';
import { useAlertContext } from 'context/alert';
import ConfigureLoanOfferForm from 'containers/configureLoanOffer';

type AddMemberActionProps = ActionIndex & { allowRemove?: boolean };

// TODO: remove address deleted from addresses list when removeAddMemberFields is called.
const LoanOfferAction: React.FC<AddMemberActionProps> = ({
    actionIndex,
    allowRemove = true,
}) => {
    const { t } = useTranslation();
    const { removeAction, duplicateAction } = useActionsContext();
    const { setValue, clearErrors, resetField, getValues } = useFormContext();
    const { alert } = useAlertContext();

    const resetAddMemberFields = () => {
        clearErrors(`actions.${actionIndex}`);
        resetField(`actions.${actionIndex}`);
        setValue(`actions.${actionIndex}.inputs`, {
            address: '',
        });
        setValue(`addresses.${actionIndex}`, '');
        alert(t('alert.chip.resetAction'));
    };

    const removeLoanOfferFields = (actionIndex: number) => {
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
                    removeLoanOfferFields(actionIndex);
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
            methodName={t('loanOffer.title')}
            dropdownItems={methodActions} 
            methodDescription={t('loanOffer.subtitleCard')}
        >
            <FormItem className="py-3 space-y-3 rounded-b-xl">
                <ConfigureLoanOfferForm actionIndex={actionIndex} />
            </FormItem>
        </AccordionMethod>
    );
};

export default LoanOfferAction;
