import {
    AlertInline,
    Label,
    ValueInput,
} from '@aragon/ui-components';
import React, { useEffect } from 'react';
import {
    Controller,
    FormState,
    useFormContext,
    useWatch,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { WithdrawAction } from 'pages/newWithdraw';
import { ActionIndex, InterestRateType, SupportedNetwork } from 'utils/types';
import { SUPPORTED_TOKENS } from 'utils/config';

type ConfigureCreditDelegationFormProps = ActionIndex;

const ConfigureCreditDelegationForm: React.FC<ConfigureCreditDelegationFormProps> = ({
    actionIndex,
}) => {
    const { t } = useTranslation();
    const { control, setValue } = useFormContext();

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
            setValue(`actions.${actionIndex}.name`, 'credit_delegation');
        }
    }, [actionIndex, name, setValue]);

    /*************************************************
     *                    Render                     *
     *************************************************/
    return (
        <>
            {/* User address */}
            <FormItem>
                <Label
                    label={t('creditDelegation.userInput')}
                    helpText={t('creditDelegation.input1Subtitle')}
                />
                <Controller
                    name={`actions.${actionIndex}.inputs.user`}
                    control={control}
                    render={({
                        field: { name, onBlur, onChange, value },
                        fieldState: { error },
                    }) => (
                        <>
                            <StyledInput
                                mode={error ? 'critical' : 'default'}
                                name={name}
                                type='text'
                                value={value}
                                placeholder='0x…'
                                onBlur={onBlur}
                                onChange={onChange}
                            />
                            {error?.message && (
                                <AlertInline label={error.message} mode="critical" />
                            )}
                        </>
                    )}
                />
            </FormItem>

            {/* Token address */}
            <FormItem>
                <Label
                    label={t('creditDelegation.tokenInput')}
                    helpText={t('creditDelegation.input1Subtitle')}
                />
                <Controller
                    name={`actions.${actionIndex}.inputs.token`}
                    control={control}
                    render={({
                        field: { name, onChange, value },
                        fieldState: { error },
                    }) => (
                        <>
                            <StyledSelect
                                name={name}
                                value={value}
                                onChange={onChange}
                            >
                                <option value="" disabled selected>{t('creditDelegation.selectAnOption')}</option>
                                {SUPPORTED_TOKENS[SupportedNetwork.MUMBAI].map((token) => (
                                    <option key={token.address} value={token.address}>{token.name}</option>
                                ))}
                            </StyledSelect>
                            {error?.message && (
                                <AlertInline label={error.message} mode="critical" />
                            )}
                        </>
                    )}
                />
            </FormItem>

            {/* Amount */}
            <FormItem>
                <Label
                    label={t('creditDelegation.amountInput')}
                    helpText={t('creditDelegation.input1Subtitle')}
                />
                <Controller
                    name={`actions.${actionIndex}.inputs.amount`}
                    control={control}
                    defaultValue=""
                    render={({
                        field: { name, onBlur, onChange, value },
                        fieldState: { error },
                    }) => (
                        <>
                            <StyledInput
                                mode={error ? 'critical' : 'default'}
                                name={name}
                                type="number"
                                value={value}
                                placeholder="0"
                                onBlur={onBlur}
                                onChange={onChange}
                            />
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    {error?.message && (
                                        <AlertInline label={error.message} mode="critical" />
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                />
            </FormItem>

            {/* Select Interest rate type */}
            <FormItem>
                <Label
                    label={t('creditDelegation.interestRateType')}
                    helpText={t('creditDelegation.interestRateTypeDescription')}
                />
                <Controller
                    name={`actions.${actionIndex}.inputs.interestRateType`}
                    control={control}
                    defaultValue=""
                    render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                        <>
                            <StyledSelect
                                name={name}
                                value={value}
                                onChange={onChange}
                            >
                                <option value="" disabled selected>{t('creditDelegation.selectAnOption')}</option>
                                <option value={InterestRateType.STABLE}>{InterestRateType.STABLE}</option>
                                <option value={InterestRateType.VARIABLE}>{InterestRateType.VARIABLE}</option>
                            </StyledSelect>
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

export default ConfigureCreditDelegationForm;

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

const StyledInput = styled(ValueInput)`
  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`;

const StyledSelect = styled.select.attrs({
    className: `w-full flex items-center h-6 space-x-1.5 p-0.75 pl-2 text-ui-600 
    rounded-xl border-2 border-ui-100 focus-within:ring-2 focus-within:ring-primary-500
    hover:border-ui-300 active:border-primary-500 active:ring-0`,
})``;
