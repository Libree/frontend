import {
    AlertInline,
    Label,
    ValueInput,
} from '@aragon/ui-components';
import React, { useEffect } from 'react';
import {
    Controller,
    useFormContext,
    useWatch,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { ActionIndex, SupportedNetwork } from 'utils/types';
import { SUPPORTED_TOKENS } from 'utils/config';

type ConfigureProvideLiquidityFormProps = ActionIndex;

const ConfigureProvideLiquidityForm: React.FC<ConfigureProvideLiquidityFormProps> = ({
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
            setValue(`actions.${actionIndex}.name`, 'provide_liquidity');
        }
    }, [actionIndex, name, setValue]);

    /*************************************************
     *                    Render                     *
     *************************************************/
    return (
        <>

            {/* Token 0 */}
            <FormItem>
                <Label
                    label={t('provideLiquidity.token0')}
                    helpText={t('provideLiquidity.token0Description')}
                />
                <Controller
                    name={`actions.${actionIndex}.inputs.token0`}
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

            {/* Amount token0 */}
            <FormItem>
                <Label
                    label={t('provideLiquidity.depositAmount')}
                    helpText={t('provideLiquidity.depositAmountDescription')}
                />
                <Controller
                    name={`actions.${actionIndex}.inputs.token0Amount`}
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

            {/* Token 1 */}
            <FormItem>
                <Label
                    label={t('provideLiquidity.token1')}
                    helpText={t('provideLiquidity.token1Description')}
                />
                <Controller
                    name={`actions.${actionIndex}.inputs.token1`}
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

            {/* Amount token1 */}
            <FormItem>
                <Label
                    label={t('provideLiquidity.depositAmount')}
                    helpText={t('provideLiquidity.depositAmountDescription')}
                />
                <Controller
                    name={`actions.${actionIndex}.inputs.token1Amount`}
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

            {/* Fee tier select */}
            <FormItem>
                <Label
                    label={t('provideLiquidity.feeTier')}
                    helpText={t('provideLiquidity.feeTierDescription')}
                />
                <Controller
                    name={`actions.${actionIndex}.inputs.feeTier`}
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
                                <option value="" disabled selected>{t('provideLiquidity.feeTierPlaceholder')}</option>
                                <option value={0.01}>{"0.01%"}</option>
                                <option value={0.05}>{"0.05%"}</option>
                                <option value={0.3}>{"0.3%"}</option>
                                <option value={1}>{"1%"}</option>
                            </StyledSelect>
                            {error?.message && (
                                <AlertInline label={error.message} mode="critical" />
                            )}
                        </>
                    )}
                />
            </FormItem>

            {/* Min price */}
            <FormItem>
                <Label
                    label={t('provideLiquidity.minPrice')}
                    helpText={t('provideLiquidity.minPriceDescription')}
                />
                <Controller
                    name={`actions.${actionIndex}.inputs.minPrice`}
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

            {/* Max price */}
            <FormItem>
                <Label
                    label={t('provideLiquidity.maxPrice')}
                    helpText={t('provideLiquidity.maxPriceDescription')}
                />
                <Controller
                    name={`actions.${actionIndex}.inputs.maxPrice`}
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

        </>
    );
};

export default ConfigureProvideLiquidityForm;

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
