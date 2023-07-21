import React, { useEffect, useMemo } from 'react';
import { withTransaction } from '@elastic/apm-rum-react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm, useFormState, useWatch } from 'react-hook-form';

import { FullScreenStepper, Step } from 'components/fullScreenStepper';
import GoLive, { GoLiveHeader, GoLiveFooter } from 'containers/goLive';
import { WalletField } from '../components/addWallets/row';
import { Landing } from 'utils/paths';
import { CreateDaoProvider } from 'context/createDao';
import { CHAIN_METADATA, getSupportedNetworkByChainId } from 'utils/constants';
import { useNetwork } from 'context/network';
import { useWallet } from 'hooks/useWallet';
import { useDaoDetailsQuery } from 'hooks/useDaoDetails';
import CommunityTokenSetup from 'containers/communityToken';
import CommunityVotingSetup from 'containers/communityVoting';
import CommunityDetailsSetup from 'containers/communityDetails';

export type WalletItem = {
    id: string;
    address: string;
};

export type CreateUnityDaoFormData = {
    blockchain: {
        id: number;
        label: string;
        network: string;
    };
    daoLogo: Blob;
    daoName: string;
    daoEnsName: string;
    daoSummary: string;
    tokenName: string;
    tokenSymbol: string;
    tokenTotalSupply: number;
    isCustomToken: boolean;
    links: { name: string; url: string }[];
    wallets: WalletField[];
    tokenAddress: string;
    durationMinutes: string;
    durationHours: string;
    durationDays: string;
    minimumApproval: string;
    minimumParticipation: string;
    eligibilityType: 'token' | 'anyone' | 'multisig';
    eligibilityTokenAmount: number | string;
    support: string;
    membership: string;
    earlyExecution: boolean;
    voteReplacement: boolean;
    multisigWallets: WalletItem[];
    multisigMinimumApprovals: number;
    creditDelegationPlugin: string;
    subGovernancePlugin: string;
    vaultPlugin: string;
    uniswapV3Plugin: string;
};

const defaultValues = {
    tokenName: '',
    tokenAddress: '',
    tokenSymbol: '',
    tokenTotalSupply: 1,
    links: [{ name: '', url: '' }],

    // Uncomment when DAO Treasury minting is supported
    // wallets: [{address: constants.AddressZero, amount: '0'}],
    earlyExecution: true,
    voteReplacement: false,
    membership: 'token',
    eligibilityType: 'token' as CreateUnityDaoFormData['eligibilityType'],
    eligibilityTokenAmount: 1,
    isCustomToken: true,
    durationDays: '1',
    durationHours: '0',
    durationMinutes: '0',
    minimumApproval: '50',
    minimumParticipation: '1',
};

const CreateUnityDAO: React.FC = () => {
    const { t } = useTranslation();
    const { chainId } = useWallet();
    const { setNetwork } = useNetwork();
    const formMethods = useForm<CreateUnityDaoFormData>({
        mode: 'onChange',
        defaultValues,
    });
    const { data: daoDetails } = useDaoDetailsQuery();
    const { errors } = useFormState({ control: formMethods.control });
    const [
        blockchain,
        daoName,
        daoSummary,
        tokenName,
        tokenSymbol,
    ] = useWatch({
        control: formMethods.control,
        name: [
            'blockchain',
            'daoName',
            'daoSummary',
            'tokenName',
            'tokenSymbol'
        ],
    });

    // Note: The wallet network determines the expected network when entering
    // the flow so that the process is more convenient for already logged in
    // users and so that the process doesn't start with a warning. Afterwards,
    // the select blockchain form dictates the expected network
    useEffect(() => {
        // get the default expected network using the connected wallet, use ethereum
        // mainnet in case user accesses the flow without wallet connection. Ideally,
        // this should not happen
        const defaultNetwork = 'mumbai';

        // update the network context
        setNetwork(defaultNetwork);

        // set the default value in the form
        formMethods.setValue('blockchain', {
            id: CHAIN_METADATA[defaultNetwork].id,
            label: CHAIN_METADATA[defaultNetwork].name,
            network: CHAIN_METADATA[defaultNetwork].testnet ? 'test' : 'main',
        });

        // intentionally disabling this next line so that changing the
        // wallet network doesn't cause effect to run
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /*************************************************
     *             Step Validation States            *
     *************************************************/
    const daoDetailsIsValid = useMemo(() => {
        if (!blockchain || !daoName || !daoSummary) return false;

        return errors.daoName ||
            errors.daoSummary
            ? false
            : true;
    }, [
        blockchain,
        daoName,
        daoSummary,
        errors.daoName,
        errors.daoSummary,
    ]);

    const daoConfigIsValid = useMemo(() => {
        if (!tokenName || !tokenSymbol) return false;

        return errors.tokenName ||
            errors.tokenSymbol
            ? false
            : true;
    }, [
        tokenName,
        tokenSymbol,
    ]);

    /*************************************************
     *                    Render                     *
     *************************************************/
    return (
        <FormProvider {...formMethods}>
            <CreateDaoProvider>
                <FullScreenStepper
                    wizardProcessName={t('createDAO.title')}
                    navLabel={t('createDAO.title')}
                    returnPath={Landing}
                    processType="DaoCreation"
                >
                    <Step
                        wizardDescription={t('createUnityDAO.step1.description')}
                        isNextButtonDisabled={!daoDetailsIsValid}
                    >
                        <CommunityDetailsSetup />
                    </Step>
                    <Step
                        isNextButtonDisabled={!daoConfigIsValid}
                    >
                        <CommunityTokenSetup />
                        <CommunityVotingSetup daoDetails={daoDetails} />
                    </Step>
                    <Step
                        hideWizard
                        fullWidth
                        customHeader={<GoLiveHeader />}
                        customFooter={<GoLiveFooter />}
                    >
                        <GoLive
                            blockchainEditStep={1}
                            daoMetadataEditStep={1}
                            communityEditStep={2}
                            governanceEditStep={2}
                        />
                    </Step>
                </FullScreenStepper>
            </CreateDaoProvider>
        </FormProvider>
    );
};

export default withTransaction('CreateUnityDAO', 'component')(CreateUnityDAO);
