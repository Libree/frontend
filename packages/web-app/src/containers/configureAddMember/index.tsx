import {
    AlertInline,
    Label,
    WalletInput,
    InputValue,
} from '@aragon/ui-components';
import React, { useCallback, useEffect } from 'react';
import {
    Controller,
    FormState,
    useFormContext,
    useWatch,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { useNetwork } from 'context/network';
import { WithdrawAction } from 'pages/newWithdraw';
import { CHAIN_METADATA } from 'utils/constants';
import { ActionIndex } from 'utils/types';

type ConfigureAddMemberFormProps = ActionIndex;

const ConfigureAddMemberForm: React.FC<ConfigureAddMemberFormProps> = ({
    actionIndex,
}) => {
    const { t } = useTranslation();
    const { network } = useNetwork();

    const { control, setValue, getValues } =
        useFormContext();

    const [name] =
        useWatch({
            name: [
                `actions.${actionIndex}.name`,
            ],
        });

    /*************************************************
     *                    Hooks                      *
     *************************************************/

    useEffect(() => {
        if (!name) {
            setValue(`actions.${actionIndex}.name`, 'add_member');
        }
    }, [actionIndex, name, setValue]);

    /*************************************************
     *             Callbacks and Handlers            *
     *************************************************/

    const handleValueChanged = useCallback(
        (value: InputValue, onChange: (...event: unknown[]) => void) =>
            onChange(value),
        []
    );

    /*************************************************
     *                    Render                     *
     *************************************************/
    return (
        <>
            {/* Recipient (to) */}
            <FormItem>
                <Label
                    label={t('labels.recipient')}
                    helpText={t('addMember.input1Subtitle')}
                />
                <Controller
                    name={`addresses.${actionIndex}`}
                    control={control}
                    defaultValue={'0x'}
                    render={({
                        field: { name, onBlur, onChange, value },
                        fieldState: { error },
                    }) => (
                        <>
                            <WalletInput
                                name={name}
                                state={error && 'critical'}
                                value={value}
                                onBlur={onBlur}
                                placeholder={'0x…'}
                                onValueChange={value => handleValueChanged(value, onChange)}
                                blockExplorerURL={CHAIN_METADATA[network].lookupURL}
                            />
                            {error?.message && (
                                <AlertInline label={error.message} mode="critical" />
                            )}
                        </>
                    )}
                />
            </FormItem>

        </>
    );
};

export default ConfigureAddMemberForm;

/**
 * Check if the screen is valid
 * @param dirtyFields List of fields that have been changed
 * @param errors List of fields that have errors
 * @param tokenAddress Token address
 * @returns Whether the screen is valid
 */
export function isValid(
    dirtyFields?: FormState<WithdrawAction>['dirtyFields'],
    errors?: FormState<WithdrawAction>['errors'],
    tokenAddress?: string
) {
    // check if fields are dirty
    if (!dirtyFields?.to || !dirtyFields?.amount || !tokenAddress) return false;

    // check if fields have errors
    if (errors?.to || errors?.amount || errors?.tokenAddress) return false;

    return true;
}

/*************************************************
 *               Styled Components               *
 *************************************************/

const FormItem = styled.div.attrs({
    className: 'space-y-1.5 tablet:pb-1',
})``;
