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
import { InterestRateType, PluginInstallItem } from "./types";
import { CreditDelegator__factory } from "typechain-types/CreditDelegator__factory";
import { Subgovernance__factory } from "typechain-types/Subgovernance__factory";
import { VotingMode, VotingSettings } from "@aragon/sdk-client";

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
        ["address uniswapRouterAddress"],
        [
            CONTRACT_ADDRESSES[networkName].uniswapRouterAddress
        ],
    );

    return {
        id: PLUGIN_ADDRESSES[networkName].uniswapV3,
        data: hexToBytes(hexBytes),
    };
}


export const encodeCreditDelegationAction = (
    token: string,
    amount: number,
    interestRateMode: string,
    onBehalfOf: string,
    beneficiary: string,
    pluginAddress: string
): DaoAction => {
    const iface = CreditDelegator__factory.createInterface()

    const hexData = iface.encodeFunctionData(
        'borrowAndTransfer',
        [
            token,
            amount,
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