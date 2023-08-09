import React from "react";
import { Label, WalletInputLegacy } from "@aragon/ui-components";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { SUPPORTED_TOKENS } from "utils/config";
import { SupportedNetwork } from "utils/types";
import { CollateralType, FundingSource, IsPersistent } from "pages/fundOpportunity";

const isPersistentOptions: {
    label: string;
    value: IsPersistent;
}[] = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
];

const FundOpportunityStepTwo: React.FC = () => {
    const { t } = useTranslation();
    const { control } = useFormContext();

    const [collateralType, fundingSource] = useWatch({
        control: control,
        name: ['collateralType', 'fundingSource'],
    });

    return (
        <Container>
            {/* Collateral address */}
            <FormItem>
                <Label
                    label={t('marketplace.fundOpportunity.collateralAddress')}
                />

                <Controller
                    name="collateralAddress"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                        <StyledSelect {...{ name, value, onChange }}>
                            <option value="" disabled selected>{t('creditDelegation.selectAnOption')}</option>
                            {SUPPORTED_TOKENS[SupportedNetwork.MUMBAI].map((token) => (
                                <option key={token.address} value={token.address}>{token.name}</option>
                            ))}
                        </StyledSelect>
                    )}
                />
            </FormItem>

            {collateralType as CollateralType === 'ERC20' ? (
                <>
                    {/* Collateral amount */}
                    <FormItem>
                        <Label
                            label={t('marketplace.fundOpportunity.collateralAmount')}
                        />

                        <Controller
                            name="collateralAmount"
                            control={control}
                            render={({ field: { onChange, value, name } }) => (
                                <NumberInput {...{ onChange, value, name }} />
                            )}
                        />
                    </FormItem>
                </>
            ) : (
                <>
                    {/* Collateral ID */}
                    <FormItem>
                        <Label
                            label={t('marketplace.fundOpportunity.collateralId')}
                        />

                        <Controller
                            name="collateralId"
                            control={control}
                            render={({ field: { onChange, value, name } }) => (
                                <NumberInput {...{ onChange, value, name }} />
                            )}
                        />
                    </FormItem>
                </>
            )}

            {/* Principal asset */}
            <FormItem>
                <Label
                    label={t('marketplace.fundOpportunity.principalAsset')}
                />

                <Controller
                    name="principalAsset"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                        <StyledSelect {...{ name, value, onChange }}>
                            <option value="" disabled selected>{t('creditDelegation.selectAnOption')}</option>
                            {SUPPORTED_TOKENS[SupportedNetwork.MUMBAI].map((token, index) => (
                                <option key={token.name} value={index}>{token.name}</option>
                            ))}
                        </StyledSelect>
                    )}
                />
            </FormItem>

            <DoubleItem>

                {/* Loan amount */}
                <FormItem>
                    <Label
                        label={t('marketplace.fundOpportunity.loanAmount')}
                    />

                    <Controller
                        name="loanAmount"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                            <NumberInput {...{ onChange, value, name }} />
                        )}
                    />
                </FormItem>

                {/* Loan yield */}
                <FormItem>
                    <Label
                        label={t('marketplace.fundOpportunity.loanYield')}
                    />

                    <Controller
                        name="loanYield"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                            <NumberInput {...{ onChange, value, name }} />
                        )}
                    />
                </FormItem>
            </DoubleItem>

            <DoubleItem>
                {/* Duration (in days) */}
                <FormItem>
                    <Label
                        label={t('marketplace.fundOpportunity.duration')}
                    />

                    <Controller
                        name="durationTime"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                            <NumberInput {...{ onChange, value, name }} />
                        )}
                    />
                </FormItem>

                {/* Expiration (in days) */}
                <FormItem>
                    <Label
                        label={t('marketplace.fundOpportunity.expiration')}
                    />

                    <Controller
                        name="expirationTime"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                            <NumberInput {...{ onChange, value, name }} />
                        )}
                    />
                </FormItem>
            </DoubleItem>

            {/* Borrower */}
            <FormItem>
                <Label
                    label={t('marketplace.fundOpportunity.borrower')}
                />

                <Controller
                    name="borrower"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                        <NumberInput
                            {...{ onChange, value, name }}
                            placeholder="0x..."
                        />
                    )}
                />
            </FormItem>

            {/* Is persistent */}
            <FormItem>
                <Label
                    label={t('marketplace.fundOpportunity.isPersistent')}
                />

                <Controller
                    name="isPersistent"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                        <StyledSelect {...{ name, value, onChange }}>
                            <option value="" disabled selected>{t('creditDelegation.selectAnOption')}</option>
                            {isPersistentOptions.map((item, index) => (
                                <option key={`${item.value}-${index}`} value={item.value}>{item.label}</option>
                            ))}
                        </StyledSelect>
                    )}
                />
            </FormItem>

            {fundingSource as FundingSource === 'AAVE' && (
                <>
                    {/* Interest Rate Type */}
                    <FormItem>
                        <Label
                            label={t('marketplace.fundOpportunity.interestRateType')}
                        />

                        <Controller
                            name="interestRateType"
                            control={control}
                            render={({ field: { onChange, value, name } }) => (
                                <StyledSelect {...{ name, value, onChange }}>
                                    <option value="" disabled selected>{t('creditDelegation.selectAnOption')}</option>
                                    {['Stable', 'Variable'].map((item, index) => (
                                        <option key={`${item}-${index}`} value={item}>{item}</option>
                                    ))}
                                </StyledSelect>
                            )}
                        />
                    </FormItem>
                </>
            )}
        </Container>
    )
};

export default FundOpportunityStepTwo;

const Container = styled.div.attrs({
    className: 'flex flex-col w-full space-y-2'
})``;

const FormItem = styled.div.attrs({
    className: 'flex flex-col w-full'
})``;

const StyledSelect = styled.select.attrs({
    className: `w-full flex items-center h-6 space-x-1.5 p-0.75 pl-2 text-ui-600 
    rounded-xl border-2 border-ui-100 focus-within:ring-2 focus-within:ring-primary-500
    hover:border-ui-300 active:border-primary-500 active:ring-0`,
})``;

const NumberInput = styled(WalletInputLegacy).attrs({
    className: 'px-2'
})``;

const DoubleItem = styled.div.attrs({
    className: 'flex flex-col tablet:flex-row w-full space-y-2 tablet:space-x-2 tablet:space-y-0'
})``;