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

import { ActionIndex } from 'utils/types';

type ConfigureAddMemberFormProps = ActionIndex;

const ConfigureAddMemberForm: React.FC<ConfigureAddMemberFormProps> = ({
    actionIndex,
}) => {
    const { t } = useTranslation();
    const { control, setValue, getValues } = useFormContext();
    const { actions } = getValues();

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
     *                    Validators                 *
     *************************************************/

    const handleAddMember = (data: any) => {
        const actionIndexOffset = actions[0].name === 'create_group' ? -1 : 0;
        setValue(`addresses.${actionIndex + actionIndexOffset}`, data);
    };

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
                    name={`actions.${actionIndex}.inputs.address`}
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
                                onChange={(e) => {
                                    onChange(e);
                                    handleAddMember(e.target.value);
                                }}
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

/*************************************************
 *               Styled Components               *
 *************************************************/

const FormItem = styled.div.attrs({
    className: 'space-y-1.5 tablet:pb-1',
})``;

export const StyledInput = styled(ValueInput)`
  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`;
