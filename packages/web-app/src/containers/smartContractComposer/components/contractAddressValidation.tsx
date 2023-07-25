import {
  AlertInline,
  ButtonText,
  IconChevronRight,
  IconFeedback,
  IconRadioCancel,
  IconRadioMulti,
  IconSuccess,
  Link,
  Spinner,
  TextareaSimple,
  shortenAddress,
  WalletInputLegacy,
} from '@aragon/ui-components';
import {ethers} from 'ethers';
import {isAddress} from 'ethers/lib/utils';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Controller,
  useController,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components';

import ModalBottomSheetSwitcher from 'components/modalBottomSheetSwitcher';
import {useAlertContext} from 'context/alert';
import {useNetwork} from 'context/network';
import {useWallet} from 'hooks/useWallet';
import {SccFormData} from 'containers/smartContractComposer';
import {addVerifiedSmartContract} from 'services/cache';
import {
  CHAIN_METADATA,
  TransactionState,
  ManualABIFlowState,
} from 'utils/constants';
import {handleClipboardActions} from 'utils/library';
import {
  EtherscanContractResponse,
  SmartContract,
  SourcifyContractResponse,
} from 'utils/types';
import ModalHeader from './modalHeader';
import {useValidateContract} from 'hooks/useValidateContract';
import {fetchTokenData} from 'services/prices';
import {useApolloClient} from '@apollo/client';
import {getTokenInfo} from 'utils/tokens';
import {useProviders} from 'context/providers';
import {useQueryClient} from '@tanstack/react-query';
import {htmlIn} from 'utils/htmlIn';
import {trackEvent} from 'services/analytics';
import {useParams} from 'react-router-dom';
import {attachEtherNotice} from 'utils/contract';

export type AugmentedEtherscanContractResponse = EtherscanContractResponse &
  SourcifyContractResponse & {
    logo?: string;
  };

type Props = {
  isOpen: boolean;
  onVerificationSuccess: () => void;
  onClose: () => void;
  onBackButtonClicked: () => void;
};

const icons = {
  [TransactionState.APPROVE]: undefined,
  [TransactionState.WAITING]: undefined,
  [TransactionState.LOADING]: undefined,
  [TransactionState.SUCCESS]: <IconChevronRight />,
  [TransactionState.ERROR]: undefined,
};

// not exactly sure where opening will be happen or if
// these modals will be global modals. For now, keeping
// this as a "controlled" component
const ContractAddressValidation: React.FC<Props> = props => {
  const {t} = useTranslation();
  const {alert} = useAlertContext();
  const client = useApolloClient();
  const {address} = useWallet();
  const {network} = useNetwork();
  const {infura: provider} = useProviders();
  const queryClient = useQueryClient();
  const {dao: daoAddressOrEns} = useParams();

  const {control, resetField, setValue, setError} =
    useFormContext<SccFormData>();
  const {errors} = useFormState({control});
  const {
    field: {value},
    fieldState: {error},
  } = useController({name: 'ABIInput'});
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [addressField, contracts] = useWatch({
    name: ['contractAddress', 'contracts'],
    control,
  });
  const [verificationState, setVerificationState] = useState<TransactionState>(
    TransactionState.WAITING
  );
  const [contractName, setContractName] = useState<string | undefined>();
  const [ABIFlowState, setABIFlowState] = useState<ManualABIFlowState>(
    ManualABIFlowState.NOT_STARTED
  );

  const {
    sourcifyFullData,
    sourcifyPartialData,
    etherscanData,
    sourcifyLoading,
    etherscanLoading,
  } = useValidateContract(addressField, network, verificationState);

  const isTransactionSuccessful =
    verificationState === TransactionState.SUCCESS;
  const isTransactionLoading = verificationState === TransactionState.LOADING;
  const isTransactionWaiting = verificationState === TransactionState.WAITING;
  const isTransactionError = verificationState === TransactionState.ERROR;

  const abiValidator = (abi: string) => {
    try {
      new ethers.utils.Interface(abi);
      setABIFlowState(ManualABIFlowState.SUCCESS);
      return t('scc.abi.abiInput.alertWarning');
    } catch (e) {
      setABIFlowState(ManualABIFlowState.ERROR);
      return t('scc.abi.abiInput.alertCritical');
    }
  };

  function attachSourcifyNotice(
    value: AugmentedEtherscanContractResponse['output']
  ) {
    // [['methodName1', 'MethodDescription1'], ['methodName2', 'MethodDescription2'],...]
    const methods = Object.entries(value?.devdoc.methods);

    return value?.abi.map(action => {
      if (action.type === 'function' && methods) {
        const method = methods.find(
          ([methodName]) =>
            methodName.substring(0, methodName.indexOf('(')) === action.name
        );

        if (method) {
          action.notice = method[1].details;
          action?.inputs.filter(input => {
            input.notice = method[1].params?.[input.name];
          });
        }
      }

      return action;
    });
  }

  const setVerifiedContract = useCallback(
    (type: string, value: AugmentedEtherscanContractResponse, logo: string) => {
      if (value) {
        setVerificationState(TransactionState.SUCCESS);
        let verifiedContract = {} as SmartContract;

        if (type === 'sourcifyMatch') {
          const actions = attachSourcifyNotice(value.output);

          verifiedContract = {
            actions,
            address: addressField,
            name: value.output.devdoc.title,
            logo,
          };
          setContractName(value.output.devdoc.title as string);
        } else {
          const actions = attachEtherNotice(
            value.SourceCode,
            value.ContractName,
            JSON.parse(value?.ABI || '')
          );

          verifiedContract = {
            actions: actions,
            address: addressField,
            name: value.ContractName,
            logo,
          };
          setContractName(value?.ContractName);
        }

        setValue('contracts', [...contracts, verifiedContract]);

        // add to storage
        addVerifiedSmartContract(
          verifiedContract,
          address,
          CHAIN_METADATA[network].id
        );
      } else {
        setContractName('');
        setVerificationState(TransactionState.WAITING);
      }
    },
    [address, addressField, contracts, network, setValue]
  );

  useEffect(() => {
    async function setData() {
      if (!sourcifyLoading && !etherscanLoading && isTransactionLoading) {
        // fetch smart contract logo
        const tokenData = await getTokenInfo(
          addressField,
          provider,
          CHAIN_METADATA[network].nativeCurrency
        ).then(value => {
          return fetchTokenData(addressField, client, network, value.symbol);
        });

        setVerificationState(TransactionState.SUCCESS);

        if (
          sourcifyFullData ||
          sourcifyPartialData ||
          etherscanData.result[0].ABI !== 'Contract source code not verified'
        ) {
          const source = [];
          let name;
          if (sourcifyFullData || sourcifyPartialData) {
            source.push('sourcify');
            name =
              sourcifyFullData?.output?.devdoc?.title ||
              sourcifyPartialData?.output?.devdoc?.title;
          }
          if (
            etherscanData.result[0].ABI !== 'Contract source code not verified'
          ) {
            source.push('etherscan');
            name = etherscanData.result[0]?.ContractName;
          }

          trackEvent('newProposal_smartContractConnection_succeeded', {
            dao_address: daoAddressOrEns,
            smart_contract_address: addressField,
            smart_contract_name: name,
            source,
          });
        } else {
          trackEvent('newProposal_smartContractConnection_failed', {
            dao_address: daoAddressOrEns,
            smart_contract_address: addressField,
          });
        }

        //prioritize sourcify over etherscan if sourcify data is available
        if (sourcifyFullData || sourcifyPartialData) {
          if (sourcifyFullData) {
            sourcifyFullData.output.devdoc.title =
              sourcifyFullData.output.devdoc.title ||
              etherscanData.result[0].ContractName;
          }

          if (sourcifyPartialData) {
            sourcifyPartialData.output.devdoc.title =
              sourcifyPartialData.output.devdoc.title ||
              etherscanData.result[0].ContractName;
          }

          setVerifiedContract(
            'sourcifyMatch',
            sourcifyFullData || sourcifyPartialData,
            tokenData?.imgUrl || ''
          );
        } else if (
          etherscanData.result[0].ABI !== 'Contract source code not verified'
        ) {
          setVerifiedContract(
            'etherscanMatch',
            etherscanData.result[0],
            tokenData?.imgUrl || ''
          );
        } else {
          setContractName('');
          setVerificationState(TransactionState.ERROR);
          setABIFlowState(ManualABIFlowState.WAITING);
        }
      }
    }

    setData();
  }, [
    addressField,
    client,
    daoAddressOrEns,
    etherscanData,
    etherscanLoading,
    isTransactionLoading,
    network,
    provider,
    setError,
    setVerifiedContract,
    sourcifyFullData,
    sourcifyLoading,
    sourcifyPartialData,
    t,
  ]);

  const label = {
    [TransactionState.APPROVE]: '',
    [TransactionState.WAITING]: t('scc.validation.ctaLabelWaiting'),
    [TransactionState.LOADING]: '',
    [TransactionState.SUCCESS]: t('scc.validation.ctaLabelSuccess'),
    [TransactionState.ERROR]: t('scc.validation.ctaLabelWarning'),
  };

  const ABIFlowLabel = {
    [ManualABIFlowState.WAITING]: t('scc.validation.ctaLabelWarning'),
    [ManualABIFlowState.ABI_INPUT]: t('scc.abi.ctaLabelWaiting'),
    [ManualABIFlowState.SUCCESS]: t('scc.validation.ctaLabelSuccess'),
    [ManualABIFlowState.ERROR]: t('scc.abi.ctaLabelCritical'),
  };

  // clear field when there is a value, else paste
  const handleAdornmentClick = useCallback(
    (value: string, onChange: (value: string) => void) => {
      // when there is a value clear it
      if (value && !isTransactionSuccessful && !isTransactionLoading) {
        onChange('');
        alert(t('alert.chip.inputCleared'));
      } else handleClipboardActions(value, onChange, alert);
    },
    [alert, isTransactionLoading, isTransactionSuccessful, t]
  );

  const addressValidator = (value: string) => {
    // duplication: contract already connected
    const addressExists = contracts.some(
      c => c.address.toLowerCase() === value.toLowerCase()
    );

    if (addressExists) return t('errors.duplicateContractAddress');

    // check if address is valid address string
    if (isAddress(value)) return true;
    else return t('errors.invalidAddress');
  };

  const adornmentText = useMemo(() => {
    if (isTransactionSuccessful || isTransactionLoading)
      return t('labels.copy');
    if (!!addressField && addressField !== '') return t('labels.clear');
    return t('labels.paste');
  }, [addressField, isTransactionLoading, isTransactionSuccessful, t]);

  const isButtonDisabled = useMemo(
    () => errors.contractAddress !== undefined,
    [errors.contractAddress]
  );

  const sourcifyValidationStatus = useMemo(() => {
    if (sourcifyLoading && !isTransactionError) {
      return (
        <div className="flex space-x-1">
          <Spinner size={'xs'} className="text-primary-500" />
          <VerificationStatus colorClassName="text-primary-800">
            {t('scc.validation.sourcifyStatusPending')}
          </VerificationStatus>
        </div>
      );
    } else {
      if (sourcifyFullData) {
        return (
          <div className="flex space-x-1">
            <IconSuccess className="text-success-500" />
            <VerificationStatus colorClassName="text-success-800">
              {t('scc.validation.sourcifyStatusSuccess')}
            </VerificationStatus>
          </div>
        );
      } else if (sourcifyPartialData) {
        return (
          <div className="flex space-x-1">
            <IconRadioMulti className="text-warning-500" />
            <VerificationStatus colorClassName="text-warning-800">
              {t('scc.validation.sourcifyStatusWarning')}
            </VerificationStatus>
          </div>
        );
      } else {
        return (
          <div className="flex space-x-1">
            <IconRadioCancel className="text-critical-500" />
            <VerificationStatus colorClassName="text-critical-800">
              {t('scc.validation.sourcifyStatusCritical')}
            </VerificationStatus>
          </div>
        );
      }
    }
  }, [
    isTransactionError,
    sourcifyFullData,
    sourcifyLoading,
    sourcifyPartialData,
    t,
  ]);

  const etherscanValidationStatus = useMemo(() => {
    if (etherscanLoading && !isTransactionError) {
      return (
        <div className="flex space-x-1">
          <Spinner size={'xs'} className="text-primary-500" />
          <VerificationStatus colorClassName="text-primary-800">
            {t('scc.validation.etherscanStatusPending')}
          </VerificationStatus>
        </div>
      );
    } else {
      if (
        etherscanData &&
        etherscanData?.result[0].ABI !== 'Contract source code not verified'
      ) {
        return (
          <div className="flex space-x-1">
            <IconSuccess className="text-success-500" />
            <VerificationStatus colorClassName="text-success-800">
              {t('scc.validation.etherscanStatusSuccess')}
            </VerificationStatus>
          </div>
        );
      } else {
        return (
          <div className="flex space-x-1">
            <IconRadioCancel className="text-critical-500" />
            <VerificationStatus colorClassName="text-critical-800">
              {t('scc.validation.etherscanStatusCritical')}
            </VerificationStatus>
          </div>
        );
      }
    }
  }, [etherscanData, etherscanLoading, isTransactionError, t]);

  return (
    <ModalBottomSheetSwitcher isOpen={props.isOpen} onClose={props.onClose}>
      <ModalHeader
        title={t('scc.validation.modalTitle')}
        onClose={() => {
          // clear contract address field
          resetField('contractAddress');
          setVerificationState(TransactionState.WAITING);
          props.onClose();
        }}
        onBackButtonClicked={props.onBackButtonClicked}
        showBackButton={
          !(
            verificationState === TransactionState.LOADING ||
            isTransactionSuccessful
          )
        }
        showCloseButton={!isTransactionLoading}
      />
      <Content>
        <DescriptionContainer>
          <Title>{t('scc.validation.addressInputLabel')}</Title>
          <Description>
            {t('scc.validation.addressInputHelp')}
            <Link
              external
              label={t('labels.etherscan')}
              href={`${CHAIN_METADATA[network].explorer}`}
              className="ml-0.5"
            />
          </Description>
        </DescriptionContainer>
        <Controller
          name="contractAddress"
          rules={{
            required: t('errors.required.tokenAddress'),
            validate: addressValidator,
          }}
          control={control}
          defaultValue={''}
          render={({
            field: {name, onBlur, onChange, value},
            fieldState: {error},
          }) => (
            <>
              <WalletInputLegacy
                mode={error ? 'critical' : 'default'}
                name={name}
                onBlur={onBlur}
                value={value}
                onChange={onChange}
                disabledFilled={isTransactionSuccessful || isTransactionLoading}
                placeholder="0x ..."
                adornmentText={adornmentText}
                onAdornmentClick={() => handleAdornmentClick(value, onChange)}
              />
              <div className="mt-1">
                {error?.message && (
                  <AlertInline label={error.message} mode="critical" />
                )}
              </div>
            </>
          )}
        />

        {!isTransactionWaiting &&
          (ABIFlowState === ManualABIFlowState.NOT_STARTED ||
            ABIFlowState === ManualABIFlowState.WAITING) && (
            <VerificationCard>
              <VerificationTitle>
                {/* if contract name is not available, show the address */}
                {contractName || shortenAddress(addressField)}
              </VerificationTitle>
              <VerificationWrapper>
                {sourcifyValidationStatus}
                {!isTransactionLoading && (
                  <Link
                    external
                    type="neutral"
                    iconRight={<IconFeedback height={13} width={13} />}
                    href={`https://sourcify.dev/#/lookup/${addressField}`}
                    label={t('scc.validation.explorerLinkLabel')}
                    className="ft-text-sm"
                  />
                )}
              </VerificationWrapper>
              <VerificationWrapper>
                {etherscanValidationStatus}
                {!isTransactionLoading && (
                  <Link
                    external
                    type="neutral"
                    iconRight={<IconFeedback height={13} width={13} />}
                    href={`${CHAIN_METADATA[network].explorer}address/${addressField}#code`}
                    label={t('scc.validation.explorerLinkLabel')}
                    className="ft-text-sm"
                  />
                )}
              </VerificationWrapper>
            </VerificationCard>
          )}

        {ABIFlowState !== ManualABIFlowState.NOT_STARTED &&
          ABIFlowState !== ManualABIFlowState.WAITING &&
          !isTransactionWaiting && (
            <>
              <div className="mt-2 font-bold text-ui-700 ft-text-base">
                {t('scc.abi.abiInputLabel')}
              </div>
              <p
                className="mt-0.5 text-sm text-ui-600"
                dangerouslySetInnerHTML={{
                  __html: htmlIn(t)('scc.abi.abiInputHelp'),
                }}
              />
              <div className="mt-1.5">
                <Controller
                  name="ABIInput"
                  rules={{
                    required: t('errors.required.summary'),
                    validate: value => abiValidator(value),
                  }}
                  render={({field: {name, onBlur, onChange, value}}) => (
                    <>
                      <TextareaSimple
                        name={name}
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                      />
                    </>
                  )}
                />
              </div>
            </>
          )}

        {isTransactionLoading ? (
          <ButtonText
            label={t('scc.validation.cancelLabel') as string}
            onClick={async () => {
              queryClient.cancelQueries({
                queryKey: [
                  'verifyContractEtherscan',
                  'verifycontractfull_matchSourcify',
                  'verifycontractpartial_matchSourcify',
                ],
              });
              setVerificationState(TransactionState.WAITING);
            }}
            size="large"
            className="mt-3 w-full"
            mode="secondary"
          />
        ) : (
          <ButtonText
            label={
              ABIFlowState !== ManualABIFlowState.NOT_STARTED
                ? ABIFlowLabel[ABIFlowState]
                : label[verificationState]
            }
            onClick={async () => {
              if (verificationState === TransactionState.SUCCESS) {
                props.onVerificationSuccess();
                // clear contract address field
                resetField('contractAddress');
                setVerificationState(TransactionState.WAITING);

                trackEvent('newProposal_createAction_clicked', {
                  dao_address: daoAddressOrEns,
                  smart_contract_address: addressField,
                  smart_contract_name: contractName,
                });
              } else if (ABIFlowState === ManualABIFlowState.NOT_STARTED) {
                // contract address entered for validation
                trackEvent('newProposal_validateSmartContract_clicked', {
                  dao_address: daoAddressOrEns,
                  smart_contract_address: addressField,
                });
                setVerificationState(TransactionState.LOADING);
              } else if (ABIFlowState === ManualABIFlowState.SUCCESS) {
                // Add ABI contract to verified contracts
                setVerifiedContract(
                  'manualABI',
                  {
                    ABI: value,
                    ContractName: addressField,
                  } as AugmentedEtherscanContractResponse,
                  ''
                );
                props.onVerificationSuccess();
                resetField('contractAddress');
                resetField('ABIInput');
                setVerificationState(TransactionState.WAITING);
                setABIFlowState(ManualABIFlowState.NOT_STARTED);

                trackEvent('newProposal_createAction_clicked', {
                  dao_address: daoAddressOrEns,
                  smart_contract_address: addressField,
                  smart_contract_name: contractName,
                });
              } else if (verificationState === TransactionState.ERROR) {
                // Manual ABI flow starting
                setABIFlowState(ManualABIFlowState.ABI_INPUT);
              }
            }}
            iconLeft={
              isTransactionLoading ? (
                <Spinner size="xs" color="white" />
              ) : undefined
            }
            iconRight={icons[verificationState]}
            isActive={isTransactionLoading}
            disabled={isButtonDisabled}
            size="large"
            className="mt-3 w-full"
          />
        )}
        {isTransactionError && ABIFlowState === ManualABIFlowState.WAITING && (
          <ButtonText
            label={t('scc.validation.cancelLabel')}
            onClick={() => {
              resetField('contractAddress');
              setVerificationState(TransactionState.WAITING);
              props.onClose();
            }}
            size="large"
            className="mt-2 w-full"
            mode="secondary"
          />
        )}
        {error?.message && (
          <div className="flex justify-center mt-2">
            <AlertInline
              label={error.message}
              mode={
                ABIFlowState === ManualABIFlowState.ERROR
                  ? 'critical'
                  : 'warning'
              }
            />
          </div>
        )}
      </Content>
    </ModalBottomSheetSwitcher>
  );
};

export default ContractAddressValidation;

const Content = styled.div.attrs({className: 'px-2 tablet:px-3 py-3'})``;

const DescriptionContainer = styled.div.attrs({
  className: 'space-y-0.5 mb-1.5',
})``;

const Title = styled.h2.attrs({
  className: 'text-ui-800 ft-text-base font-bold',
})``;

const Description = styled.p.attrs({
  className: 'ft-text-sm text-ui-600 font-normal',
})``;

const VerificationCard = styled.div.attrs({
  className: 'bg-ui-0 rounded-xl p-2 mt-3 space-y-2',
})``;

const VerificationTitle = styled.h2.attrs({
  className: 'text-ui-600 ft-text-base font-semibold',
})``;

const VerificationWrapper = styled.div.attrs({
  className: 'flex justify-between',
})``;

type VerificationStatusProps = {
  colorClassName: string;
};

const VerificationStatus = styled.span.attrs(
  ({colorClassName}: VerificationStatusProps) => ({
    className: 'ft-text-sm font-semibold ' + colorClassName,
  })
)<VerificationStatusProps>``;
