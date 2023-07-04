import { useApolloClient } from '@apollo/client';
import {
    AlertInline,
    Label,
    WalletInput,
    InputValue,
} from '@aragon/ui-components';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Controller,
    FormState,
    useFormContext,
    useFormState,
    useWatch,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { useAlertContext } from 'context/alert';
import { useNetwork } from 'context/network';
import { useProviders } from 'context/providers';
import { useDaoDetailsQuery } from 'hooks/useDaoDetails';
import { useWallet } from 'hooks/useWallet';
import { WithdrawAction } from 'pages/newWithdraw';
import { fetchTokenData } from 'services/prices';
import { CHAIN_METADATA, ENS_SUPPORTED_NETWORKS } from 'utils/constants';
import { Web3Address, handleClipboardActions, toDisplayEns } from 'utils/library';
import { fetchBalance, getTokenInfo, isNativeToken } from 'utils/tokens';
import { ActionIndex } from 'utils/types';
import { validateTokenAddress } from 'utils/validators';

type ConfigureAddMemberFormProps = ActionIndex;

const ConfigureAddMemberForm: React.FC<ConfigureAddMemberFormProps> = ({
    actionIndex,
}) => {
    const { t } = useTranslation();
    const client = useApolloClient();
    const { network } = useNetwork();
    const { address } = useWallet();
    const { infura: provider } = useProviders();
    const { alert } = useAlertContext();

    const networkSupportsENS = ENS_SUPPORTED_NETWORKS.includes(network);

    // once the translation of the ui-components has been dealt with,
    // consider moving these inside the component itself.
    const [addressValidated, setAddressValidated] = useState(false);
    const [ensResolved, setEnsResolved] = useState(false);

    const { data: daoDetails } = useDaoDetailsQuery();

    const { control, trigger, resetField, setFocus, setValue } =
        useFormContext();

    const { errors, dirtyFields } = useFormState({ control });
    const [name, from, tokenAddress, isCustomToken, tokenBalance, tokenSymbol] =
        useWatch({
            name: [
                `actions.${actionIndex}.name`,
                `actions.${actionIndex}.from`,
                `actions.${actionIndex}.tokenAddress`,
                `actions.${actionIndex}.isCustomToken`,
                `actions.${actionIndex}.tokenBalance`,
                `actions.${actionIndex}.tokenSymbol`,
            ],
        });
    const nativeCurrency = CHAIN_METADATA[network].nativeCurrency;

    /*************************************************
     *                    Hooks                      *
     *************************************************/
    useEffect(() => {
        if (isCustomToken) setFocus(`actions.${actionIndex}.tokenAddress`);

        if (from === '' && daoDetails?.address) {
            setValue(`actions.${actionIndex}.from`, daoDetails?.address);
        }
    }, [
        address,
        daoDetails?.address,
        from,
        actionIndex,
        isCustomToken,
        setFocus,
        setValue,
        nativeCurrency,
    ]);

    useEffect(() => {
        if (!name) {
            setValue(`actions.${actionIndex}.name`, 'withdraw_assets');
        }
    }, [actionIndex, name, setValue]);

    // Fetch custom token information
    useEffect(() => {
        if (!address || !isCustomToken || !tokenAddress) return;

        const fetchTokenInfo = async () => {
            if (errors.tokenAddress !== undefined) {
                if (dirtyFields.amount)
                    trigger([
                        `actions.${actionIndex}.amount`,
                        `actions.${actionIndex}.tokenSymbol`,
                    ]);
                return;
            }

            try {
                // fetch token balance and token metadata
                const allTokenInfoPromise = Promise.all([
                    isNativeToken(tokenAddress)
                        ? provider.getBalance(daoDetails?.address as string)
                        : fetchBalance(
                            tokenAddress,
                            daoDetails?.address as string,
                            provider,
                            nativeCurrency
                        ),
                    fetchTokenData(tokenAddress, client, network, tokenSymbol),
                    getTokenInfo(tokenAddress, provider, nativeCurrency),
                ]);

                const [balance, apiData, chainData] = await allTokenInfoPromise;
                if (apiData) {
                    setValue(`actions.${actionIndex}.tokenName`, apiData.name);
                    setValue(`actions.${actionIndex}.tokenSymbol`, apiData.symbol);
                    setValue(`actions.${actionIndex}.tokenImgUrl`, apiData.imgUrl);
                    setValue(`actions.${actionIndex}.tokenPrice`, apiData.price);
                }

                if (!apiData && chainData) {
                    setValue(`actions.${actionIndex}.tokenName`, chainData.name);
                    setValue(`actions.${actionIndex}.tokenSymbol`, chainData.symbol);
                }

                setValue(
                    `actions.${actionIndex}.tokenDecimals`,
                    Number(chainData.decimals)
                );
                setValue(`actions.${actionIndex}.tokenBalance`, balance);
            } catch (error) {
                /**
                 * Error is intentionally swallowed. Passing invalid address will
                 * return error, but should not be thrown.
                 * Also, double safeguard. Should not actually fall into here since
                 * tokenAddress should be valid in the first place for balance to be fetched.
                 */
                console.error(error);
            }
            if (dirtyFields.amount)
                trigger([
                    `actions.${actionIndex}.amount`,
                    `actions.${actionIndex}.tokenSymbol`,
                ]);
        };

        if (daoDetails?.address) {
            fetchTokenInfo();
        }
    }, [
        address,
        dirtyFields.amount,
        errors.tokenAddress,
        actionIndex,
        isCustomToken,
        provider,
        setValue,
        tokenAddress,
        trigger,
        client,
        network,
        daoDetails?.address,
        nativeCurrency,
        tokenSymbol,
    ]);

    /*************************************************
     *             Callbacks and Handlers            *
     *************************************************/

    // clear field when there is a value, else paste
    const handleAdornmentClick = useCallback(
        (value: string, onChange: (value: string) => void) => {
            // when there is a value clear it
            if (value) {
                onChange('');
                alert(t('alert.chip.inputCleared'));
            } else handleClipboardActions(value, onChange, alert);
        },
        [alert, t]
    );

    const resolveEnsNameFromAddress = useCallback(
        (address: string | Promise<string>) => provider.lookupAddress(address),
        [provider]
    );

    const resolveAddressFromEnsName = useCallback(
        (ensName: string | Promise<string>) => provider.resolveName(ensName),
        [provider]
    );

    const handleValueChanged = useCallback(
        (value: InputValue, onChange: (...event: unknown[]) => void) =>
            onChange(value),
        []
    );

    /*************************************************
     *                Field Validators               *
     *************************************************/
    const addressValidator = useCallback(
        async (address: string) => {
            if (isNativeToken(address)) return true;

            const validationResult = await validateTokenAddress(address, provider);

            // address invalid, reset token fields
            if (validationResult !== true) {
                resetField(`actions.${actionIndex}.tokenName`);
                resetField(`actions.${actionIndex}.tokenImgUrl`);
                resetField(`actions.${actionIndex}.tokenSymbol`);
                resetField(`actions.${actionIndex}.tokenBalance`);
            }

            return validationResult;
        },
        [actionIndex, provider, resetField]
    );

    const recipientValidator = useCallback(
        async (value: InputValue) => {
            const recipient = new Web3Address(provider, value.address, value.ensName);

            // empty field
            if (value.address === '' && value.ensName === '')
                return t('errors.required.recipient');

            // withdrawing to DAO
            if (
                recipient.address === daoDetails?.address ||
                recipient.ensName === toDisplayEns(daoDetails?.ensDomain)
            )
                return 'Cant withdraw to your own address';

            if (recipient.ensName && !recipient.address)
                return (await recipient.isValidEnsName()) ? true : 'Invalid ENS name';

            if (recipient.address && !recipient.ensName)
                return recipient.isAddressValid() ? true : t('errors.invalidAddress');
        },
        [daoDetails?.address, daoDetails?.ensDomain, provider, t]
    );

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
                    name={`actions.${actionIndex}.to`}
                    control={control}
                    defaultValue={{ address: '', ensName: '' }}
                    rules={{ validate: recipientValidator }}
                    render={({
                        field: { name, onBlur, onChange, value },
                        fieldState: { error },
                    }) => (
                        <>
                            <WalletInput
                                name={name}
                                state={error && 'critical'}
                                value={value}
                                onBlur={onBlur}
                                placeholder={networkSupportsENS ? 'ENS or 0x…' : '0x…'}
                                onValueChange={value => handleValueChanged(value, onChange)}
                                blockExplorerURL={CHAIN_METADATA[network].lookupURL}
                                onEnsResolved={() => {
                                    setAddressValidated(false);
                                    setEnsResolved(true);
                                }}
                                onAddressValidated={() => {
                                    setEnsResolved(false);
                                    setAddressValidated(true);
                                }}
                                {...(networkSupportsENS && {
                                    resolveEnsNameFromAddress,
                                    resolveAddressFromEnsName,
                                })}
                            />
                            {!error?.message && ensResolved && (
                                <AlertInline
                                    label={'ENS resolved successfully'}
                                    mode="success"
                                />
                            )}
                            {!error?.message && addressValidated && (
                                <AlertInline
                                    label={'Address resolved successfully'}
                                    mode="success"
                                />
                            )}
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
