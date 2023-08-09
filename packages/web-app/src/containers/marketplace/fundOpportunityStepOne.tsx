import React from "react";
import { Label } from "@aragon/ui-components";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

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
                            {[{ name: 'DAO treasury', value: 'DAO' }, { name: 'Aave borrow', value: 'AAVE' }].map((item, index) => (
                                <option key={item.name} value={item.value}>{item.name}</option>
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
                            {[{ name: 'ERC20 token', value: 'ERC20' }, { name: 'NFT token', value: 'NFT' }].map((item, index) => (
                                <option key={item.name} value={item.value}>{item.name}</option>
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
