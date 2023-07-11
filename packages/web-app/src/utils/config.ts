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
        creditDelegation: "0x0ee196192a8f14b3dbcf47a3f2ffb27cc6f70e43",
        subgovernance: "0xf169a825ad8d1263fe489c786681bc389ed262a3",
        uniswapV3: "0x8c67eb39596b338609ecb4fed967df121e855390",
        vault: "0x010cdc572b15ff79d9c4fa234d287b9101975ed2"
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
        creditDelegation: "my-cool-plugin-70992",
        subgovernance: "my-cool-plugin-78991",
        uniswapV3: "my-cool-plugin-78992",
        vault: "my-cool-plugin-78993"
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