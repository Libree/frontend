import { ListItemAction } from '@aragon/ui-components';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { AccordionMethod } from 'components/accordionMethod';
import { ActionIndex } from 'utils/types';
import { FormItem } from '../addAddresses';
import { useAlertContext } from 'context/alert';
import { useActionsContext } from 'context/actions';
import ConfigureSwapTokensForm from 'containers/configureSwapTokens';

type SwapTokensActionProps = ActionIndex & { allowRemove?: boolean };

const SwapTokensAction: React.FC<SwapTokensActionProps> = ({
    actionIndex,
    allowRemove = true,
}) => {
    const { t } = useTranslation();
    const { removeAction, duplicateAction } = useActionsContext();
    const { setValue, clearErrors, resetField } = useFormContext();
    const { alert } = useAlertContext();

    const resetSwapTokensFields = () => {
        clearErrors(`actions.${actionIndex}`);
        resetField(`actions.${actionIndex}`);
        setValue(`actions.${actionIndex}.inputs`, {
            tokenInput: '',
            amount: 0,
            tokenOutput: '',
        });
        alert(t('alert.chip.resetAction'));
    };

    const removeSwapTokensFields = (actionIndex: number) => {
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
                    alert(t('alert.chip.duplicateAction'))
                },
            },
            {
                component: <ListItemAction title={t('labels.resetAction')} bgWhite />,
                callback: resetSwapTokensFields,
            },
        ];

        if (allowRemove) {
            result.push({
                component: (
                    <ListItemAction title={t('labels.removeEntireAction')} bgWhite />
                ),
                callback: () => {
                    removeSwapTokensFields(actionIndex);
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
            methodName={t('swapTokens.title')}
            dropdownItems={methodActions}
            methodDescription={t('swapTokens.subtitle')}
        >
            <FormItem className="py-3 space-y-3 rounded-b-xl">
                <ConfigureSwapTokensForm actionIndex={actionIndex} />
            </FormItem>
        </AccordionMethod>
    );
};

export default SwapTokensAction;
