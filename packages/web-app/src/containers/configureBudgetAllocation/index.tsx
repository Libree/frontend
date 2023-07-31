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
import { groups } from 'pages/communityGroups';

type ConfigureBudgetAllocationFormProps = ActionIndex;

const ConfigureBudgetAllocationForm: React.FC<ConfigureBudgetAllocationFormProps> = ({
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

    const protocols = ['Uniswap', 'Aave', 'PWN'];

    /*************************************************
     *                    Hooks                      *
     *************************************************/

    useEffect(() => {
        if (!name) {
            setValue(`actions.${actionIndex}.name`, 'budget_allocation');
        }
    }, [actionIndex, name, setValue]);

    /*************************************************
     *                    Render                     *
     *************************************************/
    return (
        <>

            {/* Protocol */}
            <FormItem>
                <Label
                    label={t('budgetAllocation.protocolInput')}
                    helpText={t('budgetAllocation.protocolDescription')}
                />
                <Controller
                    name={`actions.${actionIndex}.inputs.protocol`}
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
                                <option value="" disabled>{t('creditDelegation.selectAnOption')}</option>
                                {protocols.map((ptocol) => (
                                    <option key={ptocol} value={ptocol}>{ptocol}</option>
                                ))}
                            </StyledSelect>
                            {error?.message && (
                                <AlertInline label={error.message} mode="critical" />
                            )}
                        </>
                    )}
                />
            </FormItem>

            {/* Token */}
            <FormItem>
                <Label
                    label={t('budgetAllocation.tokenInput')}
                    helpText={t('budgetAllocation.tokenDescription')}
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
                                defaultValue={""}
                            >
                                <option value="" disabled>{t('creditDelegation.selectAnOption')}</option>
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

            {/* Token Amount */}
            <FormItem>
                <Label
                    label={t('budgetAllocation.amountInput')}
                    helpText={t('budgetAllocation.amountDescription')}
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

            {/* Group */}
            <FormItem>
                <Label
                    label={t('budgetAllocation.groupInput')}
                    helpText={t('budgetAllocation.groupDescription')}
                />
                <Controller
                    name={`actions.${actionIndex}.inputs.group`}
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
                                <option value="" disabled>{t('creditDelegation.selectAnOption')}</option>
                                {groups.map((group) => (
                                    <option key={group.id} value={group.id}>{group.name}</option>
                                ))}
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

export default ConfigureBudgetAllocationForm;

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
