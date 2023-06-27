import {
    SupportedNetwork,
    ContractsDeployment,
    PluginsDeployment
} from "./types"

export const CONTRACT_ADDRESSES: { [K in SupportedNetwork]: ContractsDeployment } = {
    [SupportedNetwork.MUMBAI]: {
        aavePool: "0x0b913a76beff3887d35073b8e5530755d60f78c7"
    },
    [SupportedNetwork.GOERLI]: {
        aavePool: ""
    },
    [SupportedNetwork.HOMESTEAD]: {
        aavePool: ""
    },
    [SupportedNetwork.MATIC]: {
        aavePool: ""
    }
};

export const PLUGIN_ADDRESSES: { [K in SupportedNetwork]: PluginsDeployment } = {
    [SupportedNetwork.MUMBAI]: {
        creditDelegation: "0xb42a901356c989f988b476abcb4fca847caf83ba"
    },
    [SupportedNetwork.GOERLI]: {
        creditDelegation: ""
    },
    [SupportedNetwork.HOMESTEAD]: {
        creditDelegation: ""
    },
    [SupportedNetwork.MATIC]: {
        creditDelegation: ""
    }
};


export const PLUGIN_IDS: { [K in SupportedNetwork]: PluginsDeployment } = {
    [SupportedNetwork.MUMBAI]: {
        creditDelegation: "my-cool-plugin-78999"
    },
    [SupportedNetwork.GOERLI]: {
        creditDelegation: ""
    },
    [SupportedNetwork.HOMESTEAD]: {
        creditDelegation: ""
    },
    [SupportedNetwork.MATIC]: {
        creditDelegation: ""
    }
};