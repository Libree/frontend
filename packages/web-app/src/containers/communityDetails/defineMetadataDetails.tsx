import {
    AlertInline,
    InputImageSingle,
    Label,
    TextareaSimple,
    TextInput,
} from '@aragon/ui-components';
import React, { useCallback } from 'react';
import { Controller, FieldError, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { URL_PATTERN } from 'utils/constants';
import { isOnlyWhitespace } from 'utils/library';
import { isDaoEnsNameValid } from 'utils/validators';
import { useProviders } from 'context/providers';
import { useNetwork } from 'context/network';

const DAO_LOGO = {
    maxDimension: 2400,
    minDimension: 256,
    maxFileSize: 3000000,
};

export type DefineMetadataProps = {
    arrayName?: string;
    isSettingPage?: boolean;
    bgWhite?: boolean;
};

const DefineMetadataDetails: React.FC<DefineMetadataProps> = ({
    arrayName = 'links',
    bgWhite = false,
    isSettingPage,
}) => {
    const { t } = useTranslation();
    const { isL2Network } = useNetwork();
    const { control, setError, clearErrors, getValues } = useFormContext();
    const { infura: provider } = useProviders();

    const handleImageError = useCallback(
        (error: { code: string; message: string }) => {
            const imgError: FieldError = { type: 'manual' };
            const { minDimension, maxDimension, maxFileSize } = DAO_LOGO;

            switch (error.code) {
                case 'file-invalid-type':
                    imgError.message = t('errors.invalidImageType');
                    break;
                case 'file-too-large':
                    imgError.message = t('errors.imageTooLarge', { maxFileSize });
                    break;
                case 'wrong-dimension':
                    imgError.message = t('errors.imageDimensions', {
                        minDimension,
                        maxDimension,
                    });
                    break;
                default:
                    imgError.message = t('errors.invalidImage');
                    break;
            }

            setError('daoLogo', imgError);
        },
        [setError, t]
    );

    function ErrorHandler({ value, error }: { value: string; error?: FieldError }) {
        if (error?.message) {
            if (error.message === t('infos.checkingEns')) {
                return (
                    <AlertInline
                        label={t('infos.checkingEns') as string}
                        mode="neutral"
                    />
                );
            } else {
                return <AlertInline label={error.message as string} mode="critical" />;
            }
        } else {
            if (value) {
                return (
                    <AlertInline
                        label={t('infos.ensAvailable') as string}
                        mode="success"
                    />
                );
            } else return null;
        }
    }

    return (
        <Container>

            {/* Name */}
            <FormItem>
                <Label
                    label={t('labels.daoName')}
                    helpText={t('createDAO.step2.nameSubtitle')}
                />

                <Controller
                    name="daoName"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: t('errors.required.name'),
                    }}
                    render={({
                        field: { onBlur, onChange, value, name },
                        fieldState: { error },
                    }) => (
                        <div className='flex flex-col'>
                            <TextInput
                                {...{ name, value, onBlur, onChange }}
                                placeholder={t('placeHolders.daoName')}
                            />
                            <InputCount>{`${value.length}/128`}</InputCount>
                            {error?.message && (
                                <AlertInline label={error.message} mode="critical" />
                            )}
                        </ div>
                    )}
                />
            </FormItem>

            {/* Logo */}
            <FormItem>
                <Label
                    label={t('labels.logo')}
                    helpText={t('createDAO.step2.logoSubtitle')}
                    isOptional
                    tagLabel={t('labels.optional')}
                />

                <Controller
                    name="daoLogo"
                    control={control}
                    render={({ field: { value, onChange }, fieldState: { error } }) => {
                        let preview = '';

                        try {
                            // in case url does not need to be created
                            if (URL_PATTERN.test(value)) {
                                preview = value;
                            } else {
                                preview = value ? URL.createObjectURL(value) : '';
                            }
                        } catch (error) {
                            console.error(error);
                        }

                        return (
                            <>
                                <LogoContainer>
                                    <InputImageSingle
                                        {...{ DAO_LOGO, preview }}
                                        onError={handleImageError}
                                        onChange={onChange}
                                        onlySquare
                                    />
                                </LogoContainer>
                                {error?.message && (
                                    <AlertInline label={error.message} mode="critical" />
                                )}
                            </>
                        );
                    }}
                />
            </FormItem>

            {/* Summary */}
            <SummaryFormItem>
                <Label
                    label={t('labels.description')}
                    helpText={t('createDAO.step2.descriptionSubtitle')}
                />
                <Controller
                    name="daoSummary"
                    rules={{
                        required: t('errors.required.summary'),
                        validate: value =>
                            isOnlyWhitespace(value) ? t('errors.required.summary') : true,
                    }}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <>
                            <TextareaSimple
                                {...field}
                                placeholder={t('placeHolders.daoDescription')}
                            />
                            {error?.message && (
                                <AlertInline label={error.message} mode="critical" />
                            )}
                        </>
                    )}
                />
            </SummaryFormItem>

        </Container>
    );
};

export default DefineMetadataDetails;

const Container = styled.div.attrs({
    className: 'grid grid-cols-2 gap-4',
})``;

const InputCount = styled.div.attrs({
    className: 'ft-text-sm mt-1',
})``;

const FormItem = styled.div.attrs({
    className: 'flex flex-col tablet:flex-row space-y-1.5 col-span-2 tablet:col-span-1',
})``;

const SummaryFormItem = styled.div.attrs({
    className: 'col-span-2 space-y-1.5',
})``;

const LogoContainer = styled.div.attrs({
    className: 'pt-0.5',
})``;
