import {
    SupportedNetwork,
    ContractsDeployment,
    PluginsDeployment
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