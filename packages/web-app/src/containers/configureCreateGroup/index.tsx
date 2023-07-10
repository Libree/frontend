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

type ConfigureCreateGroupFormProps = ActionIndex;

const ConfigureCreateGroupForm: React.FC<ConfigureCreateGroupFormProps> = ({
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
            setValue(`actions.${actionIndex}.name`, 'create_group');
        }
    }, [actionIndex, name, setValue]);

    /*************************************************
     *                    Render                     *
     *************************************************/
    return (
        <>
            {/* Group name */}
            <FormItem>
                <Label
                    label={t('createGroup.nameInput')}
                    helpText={t('createGroup.nameDescription')}
                />
                <Controller
                    name={`actions.${actionIndex}.inputs.groupName`}
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
                                type="text"
                                value={value}
                                placeholder={'...'}
                                onBlur={onBlur}
                                onChange={(e) => {
                                    onChange(e);
                                    setValue('groupName', e.target.value);
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

export default ConfigureCreateGroupForm;

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
