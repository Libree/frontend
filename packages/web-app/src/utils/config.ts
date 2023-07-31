import {
    SupportedNetwork,
    ContractsDeployment,
    PluginsDeployment,
    SupportedToken
} from "./types"

export const CONTRACT_ADDRESSES: { [K in SupportedNetwork]: ContractsDeployment } = {
    [SupportedNetwork.MUMBAI]: {
        aavePool: "0x0b913a76beff3887d35073b8e5530755d60f78c7",
        uniswapRouterAddress: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
        nonfungiblePositionManagerAddress: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"
    },
    [SupportedNetwork.GOERLI]: {
        aavePool: "",
        uniswapRouterAddress: "",
        nonfungiblePositionManagerAddress: ""
    },
    [SupportedNetwork.HOMESTEAD]: {
        aavePool: "",
        uniswapRouterAddress: "",
        nonfungiblePositionManagerAddress: ""
    },
    [SupportedNetwork.MATIC]: {
        aavePool: "",
        uniswapRouterAddress: "",
        nonfungiblePositionManagerAddress: ""
    }
};

export const PLUGIN_ADDRESSES: { [K in SupportedNetwork]: PluginsDeployment } = {
    [SupportedNetwork.MUMBAI]: {
        creditDelegation: "0xb27f9fe20a05e2ea6aa7b48cf8e83040f816c774",
        subgovernance: "0x78f346799eb5f956952a32afd6b18db15fd6e123",
        uniswapV3: "0x76cc69c986db52658947808617fe949e06059ad5",
        vault: "0x523c1ceefbb81d62a95c7709cbbc14e964a77d82"
    },
    [SupportedNetwork.GOERLI]: {
        creditDelegation: "",
        subgovernance: "",
        uniswapV3: "",
        vault: ""
    },
    [SupportedNetwork.HOMESTEAD]: {
        creditDelegation: "",
        subgovernance: "",
        uniswapV3: "",
        vault: ""
    },
    [SupportedNetwork.MATIC]: {
        creditDelegation: "",
        subgovernance: "",
        uniswapV3: "",
        vault: ""
    }
};


export const PLUGIN_IDS: { [K in SupportedNetwork]: PluginsDeployment } = {
    [SupportedNetwork.MUMBAI]: {
        creditDelegation: "my-cool-plugin-6016",
        subgovernance: "my-cool-plugin-6002",
        uniswapV3: "my-cool-plugin-6017",
        vault: "my-cool-plugin-6005"
    },
    [SupportedNetwork.GOERLI]: {
        creditDelegation: "",
        subgovernance: "",
        uniswapV3: "",
        vault: ""
    },
    [SupportedNetwork.HOMESTEAD]: {
        creditDelegation: "",
        subgovernance: "",
        uniswapV3: "",
        vault: ""
    },
    [SupportedNetwork.MATIC]: {
        creditDelegation: "",
        subgovernance: "",
        uniswapV3: "",
        vault: ""
    }
};

export const SUPPORTED_TOKENS: { [K in SupportedNetwork]: SupportedToken[] } = {
    [SupportedNetwork.MUMBAI]: [
        { name: "USDC", address: "0xe9dce89b076ba6107bb64ef30678efec11939234" },
        { name: "DAI", address: "0xf14f9596430931e177469715c591513308244e8f" },
        { name: "USDT", address: "0xacde43b9e5f72a4f554d4346e69e8e7ac8f352f0" },
        { name: "WETH", address: "0xd087ff96281dcf722aea82aca57e8545ea9e6c96" },
        { name: "WBTC", address: "0x97e8de167322a3bca28e8a49bc46f6ce128fec68" },

    ],
    [SupportedNetwork.GOERLI]: [],
    [SupportedNetwork.HOMESTEAD]: [],
    [SupportedNetwork.MATIC]: []
};