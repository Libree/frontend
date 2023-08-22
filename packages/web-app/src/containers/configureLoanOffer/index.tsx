import {
    AlertInline,
    Label,
    ValueInput,
} from '@aragon/ui-components';
import { useDaoDetailsQuery } from 'hooks/useDaoDetails';
import { useInstalledPlugins } from 'hooks/useInstalledPlugins';
import React, { useEffect } from 'react';
import {
    Controller,
    useFormContext,
    useWatch,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { SUPPORTED_TOKENS } from 'utils/config';
import { ActionIndex, SupportedNetwork, FundingSource, CollateralType } from 'utils/types';

type ConfigureLoanOfferFormProps = ActionIndex;

const fundingSourceOptions: {
    label: string;
    value: FundingSource;
}[] = [
        { label: 'DAO treasury', value: 'DAO' },
        { label: 'Aave borrow stable APY', value: 'AAVESTABLE' },
        { label: 'Aave borrow variable APY', value: 'AAVEVARIABLE' },
    ];

const collateralTypeOptions: {
    label: string;
    value: CollateralType;
}[] = [
        { label: 'Tokens', value: 'ERC20' },
        { label: 'NFT', value: 'NFT' },
    ];

const ConfigureLoanOfferForm: React.FC<ConfigureLoanOfferFormProps> = ({
    actionIndex,
}) => {
    const { t } = useTranslation();
    const { control, setValue } = useFormContext();
    const { data } = useDaoDetailsQuery()
    const { pwn } = useInstalledPlugins(data?.address)

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
            setValue(`actions.${actionIndex}.name`, 'loan_offer');
        }
        if(pwn){
            setValue(`actions.${actionIndex}.pwnPluginAddress`, pwn.instanceAddress)
        }
    }, [actionIndex, name, setValue, pwn]);

    /*************************************************
     *                    Validators                 *
     *************************************************/


    /*************************************************
    *                    Render                     *
    *************************************************/
    return (
        <>
            {/* Source of funds */}
            <FormItem>
                <Label
                    label={t('loanOffer.card.sourceFunds')}
                    helpText={t('loanOffer.card.sourceFundsSubtitle')}
                />
                <Controller
                    name={`actions.${actionIndex}.inputs.fundingSource`}
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
                                defaultValue={""}
                            >
                                <option value="" disabled>{t('labels.selectAnOption')}</option>
                                {fundingSourceOptions.map((item) => (
                                    <option key={item.value} value={item.value}>{item.label}</option>
                                ))}
                            </StyledSelect>
                            {error?.message && (
                                <AlertInline label={error.message} mode="critical" />
                            )}
                        </>
                    )}
                />
            </FormItem>

            {/* Lending token */}
            <FormItem>
                <Label
                    label={t('loanOffer.card.lendingToken')}
                    helpText={t('loanOffer.card.lendingTokenSubtitle')}
                />
                <Controller
                    name={`actions.${actionIndex}.inputs.principalAsset`}
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
                                defaultValue={""}
                            >
                                <option value="" disabled>{t('labels.selectAnOption')}</option>
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

            {/* Lending amount */}
            <FormItem>
                <Label
                    label={t('loanOffer.card.lendingAmount')}
                    helpText={t('loanOffer.card.lendingAmountSubtitle')}
                />
                <Controller
                    name={`actions.${actionIndex}.inputs.loanAmount`}
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

            {/* Collateral type */}
            <FormItem>
                <Label
                    label={t('loanOffer.card.collateralType')}
                    helpText={t('loanOffer.card.collateralTypeSubtitle')}
                />
                <Controller
                    name={`actions.${actionIndex}.inputs.collateralType`}
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
                                defaultValue={""}
                            >
                                <option value="" disabled>{t('labels.selectAnOption')}</option>
                                {collateralTypeOptions.map((item) => (
                                    <option key={item.value} value={item.value}>{item.label}</option>
                                ))}
                            </StyledSelect>
                            {error?.message && (
                                <AlertInline label={error.message} mode="critical" />
                            )}
                        </>
                    )}
                />
            </FormItem>

            {/* Collateral */}
            <FormItem>
                <Label
                    label={t('loanOffer.card.collateral')}
                    helpText={t('loanOffer.card.collateralSubtitle')}
                />
                <Controller
                    name={`actions.${actionIndex}.inputs.collateralAddress`}
                    control={control}
                    defaultValue={''}
                    render={({
                        field: { name, onBlur, onChange, value },
                        fieldState: { error },
                    }) => (
                        <>
                            <StyledInput
                                mode={error ? 'critical' : 'default'}
                                name={name}
                                type="text"
                                value={value}
                                placeholder="0x..."
                                onBlur={onBlur}
                            />
                            {error?.message && (
                                <AlertInline label={error.message} mode="critical" />
                            )}
                        </>
                    )}
                />
            </FormItem>


            {/* Collateral Amount*/}
            <FormItem>
                <Label
                    label={t('loanOffer.card.collateralAmount')}
                    helpText={t('loanOffer.card.collateralAmountSubtitle')}
                />
                <Controller
                    name={`actions.${actionIndex}.inputs.collateralAmount`}
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

            {/* Loan Duration */}
            <FormItem>
                <Label
                    label={t('loanOffer.card.loanDuration')}
                    helpText={t('loanOffer.card.loanDurationSubtitle')}
                />
                <Controller
                    name={`actions.${actionIndex}.inputs.durationTime`}
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

            {/* Loan Total fee */}
            <FormItem>
                <Label
                    label={t('loanOffer.card.loanTotalFee')}
                    helpText={t('loanOffer.card.loanTotalFeeSubtitle')}
                />
                <Controller
                    name={`actions.${actionIndex}.inputs.loanYield`}
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

export default ConfigureLoanOfferForm;

/*************************************************
 *               Styled Components               *
 *************************************************/

const FormItem = styled.div.attrs({
    className: 'space-y-1.5 tablet:pb-1',
})``;

const StyledSelect = styled.select.attrs({
    className: `w-full flex items-center h-6 space-x-1.5 p-0.75 pl-2 text-ui-600 
    rounded-xl border-2 border-ui-100 focus-within:ring-2 focus-within:ring-primary-500
    hover:border-ui-300 active:border-primary-500 active:ring-0`,
})``;

export const StyledInput = styled(ValueInput)`
  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`;
