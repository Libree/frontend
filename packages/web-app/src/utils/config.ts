import {
    SupportedNetwork,
    ContractsDeployment,
    PluginsDeployment,
    SupportedToken
} from "./types"

export const CONTRACT_ADDRESSES: { [K in SupportedNetwork]: ContractsDeployment } = {
    [SupportedNetwork.MUMBAI]: {
        aavePool: "0x0b913a76beff3887d35073b8e5530755d60f78c7",
        uniswapRouterAddress: "0xE592427A0AEce92De3Edee1F18E0157C05861564"
    },
    [SupportedNetwork.GOERLI]: {
        aavePool: "",
        uniswapRouterAddress: ""
    },
    [SupportedNetwork.HOMESTEAD]: {
        aavePool: "",
        uniswapRouterAddress: ""
    },
    [SupportedNetwork.MATIC]: {
        aavePool: "",
        uniswapRouterAddress: ""
    }
};

export const PLUGIN_ADDRESSES: { [K in SupportedNetwork]: PluginsDeployment } = {
    [SupportedNetwork.MUMBAI]: {
        creditDelegation: "0x8caa57707fc918d889c2c4fcad22429cfa88a655",
        subgovernance: "0x78f346799eb5f956952a32afd6b18db15fd6e123",
        uniswapV3: "0xe443595fbd674639bb18af9eb85ea687ad51851b",
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
        creditDelegation: "my-cool-plugin-6014",
        subgovernance: "my-cool-plugin-6002",
        uniswapV3: "my-cool-plugin-6004",
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