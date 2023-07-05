//TODO: Move to our own sdk
import { getNetwork, Networkish } from "@ethersproject/providers";
import { ethers } from "ethers";
import {
    SupportedNetworksArray,
    SupportedNetworks
} from "@aragon/sdk-client";

import {
    hexToBytes,
    UnsupportedNetworkError,
} from "@aragon/sdk-common";
import { CONTRACT_ADDRESSES, PLUGIN_ADDRESSES } from "./config";
import { PluginInstallItem } from "./types";

export const getPluginInstallCreditDelegation = (
    network: Networkish,
): PluginInstallItem => {
    const networkName = getNetwork(network).name as SupportedNetworks;

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
): PluginInstallItem => {
    const networkName = getNetwork(network).name as SupportedNetworks;

    if (!SupportedNetworksArray.includes(networkName)) {
        throw new UnsupportedNetworkError(networkName);
    }
    const hexBytes = ethers.utils.defaultAbiCoder.encode([],[]);

    return {
        id: PLUGIN_ADDRESSES[networkName].subgovernance,
        data: hexToBytes(hexBytes),
    };
}

export const getPluginInstallVault = (
    network: Networkish,
): PluginInstallItem => {
    const networkName = getNetwork(network).name as SupportedNetworks;

    if (!SupportedNetworksArray.includes(networkName)) {
        throw new UnsupportedNetworkError(networkName);
    }
    const hexBytes = ethers.utils.defaultAbiCoder.encode([],[]);

    return {
        id: PLUGIN_ADDRESSES[networkName].vault,
        data: hexToBytes(hexBytes),
    };
}

export const getPluginInstallUniswapV3 = (
    network: Networkish,
): PluginInstallItem => {
    const networkName = getNetwork(network).name as SupportedNetworks;

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