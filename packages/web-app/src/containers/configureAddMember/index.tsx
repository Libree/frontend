import {
    AlertInline,
    Label,
    WalletInput,
    InputValue,
} from '@aragon/ui-components';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Controller,
    FormState,
    useFormContext,
    useWatch,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { useNetwork } from 'context/network';
import { useDaoDetailsQuery } from 'hooks/useDaoDetails';
import { useWallet } from 'hooks/useWallet';
import { WithdrawAction } from 'pages/newWithdraw';
import { CHAIN_METADATA } from 'utils/constants';
import { ActionIndex } from 'utils/types';

type ConfigureAddMemberFormProps = ActionIndex;

const ConfigureAddMemberForm: React.FC<ConfigureAddMemberFormProps> = ({
    actionIndex,
}) => {
    const { t } = useTranslation();
    const { network } = useNetwork();
    const { address } = useWallet();

    // once the translation of the ui-components has been dealt with,
    // consider moving these inside the component itself.
    const [addressValidated, setAddressValidated] = useState(false);

    const { data: daoDetails } = useDaoDetailsQuery();

    const { control, setFocus, setValue } =
        useFormContext();

    const [name, from, isCustomToken] =
        useWatch({
            name: [
                `actions.${actionIndex}.name`,
                `actions.${actionIndex}.from`,
                `actions.${actionIndex}.tokenAddress`,
                `actions.${actionIndex}.isCustomToken`,
                `actions.${actionIndex}.tokenBalance`,
                `actions.${actionIndex}.tokenSymbol`,
            ],
        });
    const nativeCurrency = CHAIN_METADATA[network].nativeCurrency;

    /*************************************************
     *                    Hooks                      *
     *************************************************/
    useEffect(() => {
        if (isCustomToken) setFocus(`actions.${actionIndex}.tokenAddress`);

        if (from === '' && daoDetails?.address) {
            setValue(`actions.${actionIndex}.from`, daoDetails?.address);
        }
    }, [
        address,
        daoDetails?.address,
        from,
        actionIndex,
        isCustomToken,
        setFocus,
        setValue,
        nativeCurrency,
    ]);

    useEffect(() => {
        if (!name) {
            setValue(`actions.${actionIndex}.name`, 'withdraw_assets');
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
                    name={`actions.${actionIndex}.to`}
                    control={control}
                    defaultValue={{ address: '' }}
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
                                onAddressValidated={() => {
                                    setAddressValidated(true);
                                }}
                            />
                            {!error?.message && addressValidated && (
                                <AlertInline
                                    label={'Address resolved successfully'}
                                    mode="success"
                                />
                            )}
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
