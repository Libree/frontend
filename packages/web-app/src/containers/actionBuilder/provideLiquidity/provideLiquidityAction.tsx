import { ListItemAction } from '@aragon/ui-components';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { AccordionMethod } from 'components/accordionMethod';
import { ActionIndex } from 'utils/types';
import { FormItem } from '../addAddresses';
import { useAlertContext } from 'context/alert';
import { useActionsContext } from 'context/actions';
import ConfigureProvideLiquidityForm from 'containers/configureProvideLiquidity';

type ProvideLiquidityActionProps = ActionIndex & { allowRemove?: boolean };

const ProvideLiquidityAction: React.FC<ProvideLiquidityActionProps> = ({
    actionIndex,
    allowRemove = true,
}) => {
    const { t } = useTranslation();
    const { removeAction, duplicateAction } = useActionsContext();
    const { setValue, clearErrors, resetField } = useFormContext();
    const { alert } = useAlertContext();

    const resetProvideLiquidityFields = () => {
        clearErrors(`actions.${actionIndex}`);
        resetField(`actions.${actionIndex}`);
        setValue(`actions.${actionIndex}.inputs`, {
            token0: '',
            token0Amount: 0,
            token1: '',
            token1Amount: 0,
            feeTier: '',
            minPrice: '',
            maxPrice: '',
        });
        alert(t('alert.chip.resetAction'));
    };

    const removeProvideLiquidityFields = (actionIndex: number) => {
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
                callback: resetProvideLiquidityFields,
            },
        ];

        if (allowRemove) {
            result.push({
                component: (
                    <ListItemAction title={t('labels.removeEntireAction')} bgWhite />
                ),
                callback: () => {
                    removeProvideLiquidityFields(actionIndex);
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
            methodName={t('provideLiquidity.title')}
            dropdownItems={methodActions}
            methodDescription={t('provideLiquidity.subtitle')}
        >
            <FormItem className="py-3 space-y-3 rounded-b-xl">
                <ConfigureProvideLiquidityForm actionIndex={actionIndex} />
            </FormItem>
        </AccordionMethod>
    );
};

export default ProvideLiquidityAction;
