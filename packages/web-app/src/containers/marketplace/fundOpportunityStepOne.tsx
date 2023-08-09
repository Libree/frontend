import React from "react";
import { Label } from "@aragon/ui-components";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { CollateralType, FundingSource } from "pages/fundOpportunity";

const fundingSourceOptions: {
    label: string;
    value: FundingSource;
}[] = [
    { label: 'DAO treasury', value: 'DAO' },
    { label: 'Aave borrow', value: 'AAVE' },
];

const collateralTypeOptions: {
    label: string;
    value: CollateralType;
}[] = [
    { label: 'ERC20 token', value: 'ERC20' },
    { label: 'NFT token', value: 'NFT' },
];

const FundOpportunityStepOne: React.FC = () => {
    const { t } = useTranslation();
    const { control } = useFormContext();

    return (
        <Container>
            {/* Source of funding */}
            <FormItem>
                <Label
                    label={t('marketplace.fundOpportunity.fundingSource')}
                />

                <Controller
                    name="fundingSource"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                        <StyledSelect {...{ name, value, onChange }}>
                            <option value="" disabled selected>{t('creditDelegation.selectAnOption')}</option>
                            {fundingSourceOptions.map((item) => (
                                <option key={item.value} value={item.value}>{item.label}</option>
                            ))}
                        </StyledSelect>
                    )}
                />
            </FormItem>

            {/* Collateral Type */}
            <FormItem>
                <Label
                    label={t('marketplace.fundOpportunity.collateralType')}
                />

                <Controller
                    name="collateralType"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                        <StyledSelect {...{ name, value, onChange }}>
                            <option value="" disabled selected>{t('creditDelegation.selectAnOption')}</option>
                            {collateralTypeOptions.map((item) => (
                                <option key={item.value} value={item.value}>{item.label}</option>
                            ))}
                        </StyledSelect>
                    )}
                />
            </FormItem>
        </Container>
    )
};

export default FundOpportunityStepOne;

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
