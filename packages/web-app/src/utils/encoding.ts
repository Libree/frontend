//TODO: Move to our own sdk
import { getNetwork, Networkish } from "@ethersproject/providers";
import { ethers } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";
import {
    SupportedNetworksArray,
    SupportedNetwork,
    DaoAction
} from '@aragon/sdk-client-common';

import {
    hexToBytes,
    UnsupportedNetworkError,
    encodeRatio
} from "@aragon/sdk-common";
import { CONTRACT_ADDRESSES, PLUGIN_ADDRESSES } from "./config";
import { CollateralType, FundingSource, InterestRateType, PluginInstallItem } from "./types";
import { CreditDelegator__factory } from "typechain-types/CreditDelegator__factory";
import { ERC20__factory } from "typechain-types/ERC20__factory";
import { Uniswapv3__factory } from "typechain-types/Uniswapv3__factory";
import { Subgovernance__factory } from "typechain-types/Subgovernance__factory";
import { VotingMode, VotingSettings } from "@aragon/sdk-client";
import { getTokenInfo } from "./tokens";
import { CHAIN_METADATA, SupportedNetworks } from "./constants";
import { Pwn__factory } from "typechain-types/Pwn__factory";

export const getPluginInstallCreditDelegation = (
    network: Networkish
): PluginInstallItem => {
    const networkName = getNetwork(network).name as SupportedNetwork;

    if (!SupportedNetworksArray.includes(networkName)) {
        throw new UnsupportedNetworkError(networkName);
    }

    const hexBytes = ethers.utils.defaultAbiCoder.encode(
        ["address aavePoolAddress"],
        [
            CONTRACT_ADDRESSES[networkName].aavePool
        ],
    );

    return {
        id: PLUGIN_ADDRESSES[networkName].creditDelegation,
        data: hexToBytes(hexBytes),
    };
}

export const getPluginInstallSubgovernance = (
    network: Networkish,
    votingSettings: VotingSettings
): PluginInstallItem => {
    const networkName = getNetwork(network).name as SupportedNetwork;

    if (!SupportedNetworksArray.includes(networkName)) {
        throw new UnsupportedNetworkError(networkName);
    }

    const hexBytes = ethers.utils.defaultAbiCoder.encode([
        "(uint8 votingMode,uint32 supportThreshold,uint32 minParticipation,uint64 minDuration,uint256 minProposerVotingPower)"
    ], [
        votingSettingsToContract(votingSettings)
    ]);

    return {
        id: PLUGIN_ADDRESSES[networkName].subgovernance,
        data: hexToBytes(hexBytes),
    };
}

export const getPluginInstallVault = (
    network: Networkish
): PluginInstallItem => {
    const networkName = getNetwork(network).name as SupportedNetwork;

    if (!SupportedNetworksArray.includes(networkName)) {
        throw new UnsupportedNetworkError(networkName);
    }
    const hexBytes = ethers.utils.defaultAbiCoder.encode([], []);

    return {
        id: PLUGIN_ADDRESSES[networkName].vault,
        data: hexToBytes(hexBytes),
    };
}

export const getPluginInstallUniswapV3 = (
    network: Networkish
): PluginInstallItem => {
    const networkName = getNetwork(network).name as SupportedNetwork;

    if (!SupportedNetworksArray.includes(networkName)) {
        throw new UnsupportedNetworkError(networkName);
    }
    const hexBytes = ethers.utils.defaultAbiCoder.encode(
        ["address uniswapRouterAddress", "address nonfungiblePositionManagerAddress"],
        [
            CONTRACT_ADDRESSES[networkName].uniswapRouterAddress,
            CONTRACT_ADDRESSES[networkName].nonfungiblePositionManagerAddress
        ],
    );

    return {
        id: PLUGIN_ADDRESSES[networkName].uniswapV3,
        data: hexToBytes(hexBytes),
    };
}

export const getPluginInstallPwn = (
    network: Networkish
): PluginInstallItem => {
    const networkName = getNetwork(network).name as SupportedNetwork;

    if (!SupportedNetworksArray.includes(networkName)) {
        throw new UnsupportedNetworkError(networkName);
    }
    const hexBytes = ethers.utils.defaultAbiCoder.encode(
        ["address pwnSimpleLoanOfferAddress", "address pwnSimpleLoanAddress"],
        [
            CONTRACT_ADDRESSES[networkName].pwnSimpleLoanOfferAddress,
            CONTRACT_ADDRESSES[networkName].pwnSimpleLoanAddress,
        ],
    );

    return {
        id: PLUGIN_ADDRESSES[networkName].pwn,
        data: hexToBytes(hexBytes),
    }
};

export const encodeCreditDelegationAction = async (
    token: string,
    amount: number,
    interestRateMode: string,
    onBehalfOf: string,
    beneficiary: string,
    pluginAddress: string,
    provider: ethers.providers.Web3Provider | null,
    network: SupportedNetworks
): Promise<DaoAction> => {
    const iface = CreditDelegator__factory.createInterface()

    let tokenInfo;

    if (provider) {
        tokenInfo = await getTokenInfo(
            token,
            provider,
            CHAIN_METADATA[network].nativeCurrency
        )
    }

    const hexData = iface.encodeFunctionData(
        'borrowAndTransfer',
        [
            token,
            String(amount * Math.pow(10, tokenInfo?.decimals || 18)),
            interestRateMode == InterestRateType.STABLE ? 1 : 2,
            0,
            onBehalfOf,
            beneficiary
        ]
    )

    return {
        to: pluginAddress,
        value: ethers.utils.parseEther('0').toBigInt(),
        data: hexToBytes(hexData)
    }
}

export const encodeMakeOfferAction = async (
    fundingSource: FundingSource,
    onBehalfOf: string,
    collateralCategory: CollateralType,
    collateralAddress: string,
    collateralId: number,
    collateralAmount: number,
    loanAssetAddress: string,
    loanAmount: number,
    loanYield: number,
    duration: number,
    expiration: number = 0,
    pwnPluginAddress: string,
    aavePluginAddress: string,
    provider: ethers.providers.Web3Provider | null,
    network: SupportedNetworks
): Promise<DaoAction[]> => {
    const iface = Pwn__factory.createInterface();

    let creditDelegationAction

    if (fundingSource === 'AAVESTABLE' || fundingSource === 'AAVEVARIABLE') {
        creditDelegationAction = await encodeCreditDelegationAction(
            loanAssetAddress,
            loanAmount,
            fundingSource === 'AAVESTABLE' ? InterestRateType.STABLE : InterestRateType.VARIABLE,
            onBehalfOf,
            pwnPluginAddress,
            aavePluginAddress,
            provider,
            network
        )
    }

    const orderParams = {
        collateralCategory: collateralCategory === 'ERC20' ? 0 : 1,
        collateralAddress,
        collateralId: collateralId ? collateralId : 0,
        collateralAmount,
        loanAssetAddress,
        loanAmount,
        loanYield,
        duration,
        expiration,
        borrower: ethers.constants.AddressZero,
        lender: pwnPluginAddress,
        isPersistent: true,
    }

    const hexData = iface.encodeFunctionData(
        'makeOffer',
        [{
            ...orderParams,
            nonce: ethers.utils.id(`nonce_${orderParams.loanAmount}`)
        }],
    );

    let actions = [{
        to: pwnPluginAddress,
        value: ethers.utils.parseEther('0').toBigInt(),
        data: hexToBytes(hexData),
    }]

    if (creditDelegationAction) actions.unshift(creditDelegationAction)

    return actions
};

export const encodeCreateGroupAction = (
    groupName: string,
    addresses: string[],
    pluginAddress: string
): DaoAction => {
    const iface = Subgovernance__factory.createInterface()

    const hexData = iface.encodeFunctionData(
        'createGroup',
        [groupName, addresses]
    )

    return {
        to: pluginAddress,
        value: ethers.utils.parseEther('0').toBigInt(),
        data: hexToBytes(hexData)
    }
}


export const encodeActionsGroup = (
    daoAddress: string,
    actions: DaoAction[],
    pluginAddress: string
): DaoAction[] => {
    const iface = CreditDelegator__factory.createInterface()

    const hexData = iface.encodeFunctionData(
        'registerActions',
        [daoAddress, actions, 0]
    )

    return [{
        to: pluginAddress,
        value: ethers.utils.parseEther('0').toBigInt(),
        data: hexToBytes(hexData)
    }]
}

export function votingSettingsToContract(
    params: VotingSettings,
) {
    return [
        BigNumber.from(
            votingModeToContracts(params.votingMode || VotingMode.STANDARD),
        ),
        BigNumber.from(encodeRatio(params.supportThreshold, 6)),
        BigNumber.from(encodeRatio(params.minParticipation, 6)),
        BigNumber.from(params.minDuration),
        BigNumber.from(params.minProposerVotingPower ?? 0),
    ];
}


export const encodeApproveAction = (
    tokenAddress: string,
    spender: string,
    amount: string
): DaoAction => {
    const iface = ERC20__factory.createInterface()

    const hexData = iface.encodeFunctionData(
        'approve',
        [spender, amount]
    )

    return {
        to: tokenAddress,
        value: ethers.utils.parseEther('0').toBigInt(),
        data: hexToBytes(hexData)
    }
}

export const encodeSwapAction = async (
    tokenIn: string,
    tokenOut: string,
    fee: string,
    recipient: string,
    amountIn: string,
    amountOutMinimum: string,
    sqrtPriceLimitX96: string,
    pluginAddress: string,
    provider: ethers.providers.Web3Provider | null,
    network: SupportedNetworks
): Promise<DaoAction[]> => {

    let tokenInfo;

    if (provider) {
        tokenInfo = await getTokenInfo(
            tokenIn,
            provider,
            CHAIN_METADATA[network].nativeCurrency
        )
    }

    const amountToSwap = Number(amountIn) * Math.pow(10, tokenInfo?.decimals || 18)
    const iface = Uniswapv3__factory.createInterface()

    const hexData = iface.encodeFunctionData(
        'swap',
        [
            tokenIn,
            tokenOut,
            fee,
            recipient,
            amountToSwap,
            amountOutMinimum,
            sqrtPriceLimitX96
        ]
    )

    return [
        { ...encodeApproveAction(tokenIn, pluginAddress, amountToSwap.toString()) },
        {
            to: pluginAddress,
            value: ethers.utils.parseEther('0').toBigInt(),
            data: hexToBytes(hexData)
        }]
}

export const encodeProvideLiquidityAction = async (
    token0: string,
    token1: string,
    fee: string,
    minPrice: string,
    maxPrice: string,
    token0Amount: number,
    token1Amount: number,
    pluginAddress: string,
    provider: ethers.providers.Web3Provider | null,
    network: SupportedNetworks
): Promise<DaoAction[]> => {

    let token0Info;
    let token1Info;

    if (provider) {
        token0Info = await getTokenInfo(
            token0,
            provider,
            CHAIN_METADATA[network].nativeCurrency
        )
        token1Info = await getTokenInfo(
            token0,
            provider,
            CHAIN_METADATA[network].nativeCurrency
        )
    }

    const amount0 = token0Amount * Math.pow(10, token0Info?.decimals || 18)
    const amount1 = token1Amount * Math.pow(10, token1Info?.decimals || 18)
    const iface = Uniswapv3__factory.createInterface()

    const formatedFeed = Number(fee) * Math.pow(10, 4)

    const hexData = iface.encodeFunctionData(
        'provideLiquidity',
        [
            token0,
            token1,
            formatedFeed,
            minPrice,
            maxPrice,
            amount0,
            amount1,
            0,
            0
        ]
    )

    return [
        { ...encodeApproveAction(token0, pluginAddress, amount0.toString()) },
        { ...encodeApproveAction(token1, pluginAddress, amount1.toString()) },
        {
            to: pluginAddress,
            value: ethers.utils.parseEther('0').toBigInt(),
            data: hexToBytes(hexData)
        }]
}

export function votingModeToContracts(votingMode: VotingMode): number {
    switch (votingMode) {
        case VotingMode.STANDARD:
            return 0;
        case VotingMode.EARLY_EXECUTION:
            return 1;
        case VotingMode.VOTE_REPLACEMENT:
            return 2;
        default:
            throw new Error();
    }
}