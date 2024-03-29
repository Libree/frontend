import {
    SupportedNetwork,
    ContractsDeployment,
    PluginsDeployment,
    SupportedToken
} from "./types"
import UsdcIcon from "../public/usdc-icon.png";
import DaiIcon from "../public/dai-icon.png";
import UsdtIcon from "../public/tether-icon.png";
import WethIcon from "../public/eth-icon.png";
import WbtcIcon from "../public/btc-icon.png";

export const CONTRACT_ADDRESSES: { [K in SupportedNetwork]: ContractsDeployment } = {
    [SupportedNetwork.MUMBAI]: {
        aavePool: "0x0b913a76beff3887d35073b8e5530755d60f78c7",
        uniswapRouterAddress: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
        nonfungiblePositionManagerAddress: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
        pwnSimpleLoanOfferAddress: "0xAbA34804D2aDE17dd5064Ac7183e7929E4F940BD",
        pwnSimpleLoanAddress: "0x50160ff9c19fbE2B5643449e1A321cAc15af2b2C",
    },
    [SupportedNetwork.GOERLI]: {
        aavePool: "",
        uniswapRouterAddress: "",
        nonfungiblePositionManagerAddress: "",
        pwnSimpleLoanOfferAddress: "",
        pwnSimpleLoanAddress: "",
    },
    [SupportedNetwork.HOMESTEAD]: {
        aavePool: "",
        uniswapRouterAddress: "",
        nonfungiblePositionManagerAddress: "",
        pwnSimpleLoanOfferAddress: "",
        pwnSimpleLoanAddress: "",
    },
    [SupportedNetwork.MATIC]: {
        aavePool: "",
        uniswapRouterAddress: "",
        nonfungiblePositionManagerAddress: "",
        pwnSimpleLoanOfferAddress: "",
        pwnSimpleLoanAddress: "",
    }
};

export const PLUGIN_ADDRESSES: { [K in SupportedNetwork]: PluginsDeployment } = {
    [SupportedNetwork.MUMBAI]: {
        creditDelegation: "0xb27f9fe20a05e2ea6aa7b48cf8e83040f816c774",
        subgovernance: "0x78f346799eb5f956952a32afd6b18db15fd6e123",
        uniswapV3: "0x76cc69c986db52658947808617fe949e06059ad5",
        vault: "0x523c1ceefbb81d62a95c7709cbbc14e964a77d82",
        pwn: "0x88c107d4271dfda5bc173049db9005b54fd56541",
    },
    [SupportedNetwork.GOERLI]: {
        creditDelegation: "",
        subgovernance: "",
        uniswapV3: "",
        vault: "",
        pwn: "",
    },
    [SupportedNetwork.HOMESTEAD]: {
        creditDelegation: "",
        subgovernance: "",
        uniswapV3: "",
        vault: "",
        pwn: "",
    },
    [SupportedNetwork.MATIC]: {
        creditDelegation: "",
        subgovernance: "",
        uniswapV3: "",
        vault: "",
        pwn: "",
    }
};


export const PLUGIN_IDS: { [K in SupportedNetwork]: PluginsDeployment } = {
    [SupportedNetwork.MUMBAI]: {
        creditDelegation: "my-cool-plugin-6016",
        subgovernance: "my-cool-plugin-6002",
        uniswapV3: "my-cool-plugin-6017",
        vault: "my-cool-plugin-6005",
        pwn: "my-cool-plugin-6020",
    },
    [SupportedNetwork.GOERLI]: {
        creditDelegation: "",
        subgovernance: "",
        uniswapV3: "",
        vault: "",
        pwn: "",
    },
    [SupportedNetwork.HOMESTEAD]: {
        creditDelegation: "",
        subgovernance: "",
        uniswapV3: "",
        vault: "",
        pwn: "",
    },
    [SupportedNetwork.MATIC]: {
        creditDelegation: "",
        subgovernance: "",
        uniswapV3: "",
        vault: "",
        pwn: "",
    }
};

export const SUPPORTED_TOKENS: { [K in SupportedNetwork]: SupportedToken[] } = {
    [SupportedNetwork.MUMBAI]: [
        { name: "USDC", address: "0xe9dce89b076ba6107bb64ef30678efec11939234", decimals: 6, icon: UsdcIcon },
        { name: "DAI", address: "0xf14f9596430931e177469715c591513308244e8f", decimals: 18, icon: DaiIcon },
        { name: "USDT", address: "0xacde43b9e5f72a4f554d4346e69e8e7ac8f352f0", decimals: 6, icon: UsdtIcon },
        { name: "WETH", address: "0xd087ff96281dcf722aea82aca57e8545ea9e6c96", decimals: 18, icon: WethIcon },
        { name: "WBTC", address: "0x97e8de167322a3bca28e8a49bc46f6ce128fec68", decimals: 18, icon: WbtcIcon },

    ],
    [SupportedNetwork.GOERLI]: [],
    [SupportedNetwork.HOMESTEAD]: [],
    [SupportedNetwork.MATIC]: []
};


export const pwnSimpleLoanOfferAddress: string = '0xAbA34804D2aDE17dd5064Ac7183e7929E4F940BD'
export const pwnSimpleLoanAddress: string = '0x50160ff9c19fbE2B5643449e1A321cAc15af2b2C'