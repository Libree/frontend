/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
    BaseContract,
    BigNumber,
    BigNumberish,
    BytesLike,
    CallOverrides,
    ContractTransaction,
    Overrides,
    PayableOverrides,
    PopulatedTransaction,
    Signer,
    utils,
} from "ethers";
import type {
    FunctionFragment,
    Result,
    EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
    TypedEventFilter,
    TypedEvent,
    TypedListener,
    OnEvent,
    PromiseOrValue,
} from "./common";

export declare namespace IPWNSimpleLoanListOffer {
    export type OfferStruct = {
        collateralCategory: PromiseOrValue<BigNumberish>;
        collateralAddress: PromiseOrValue<string>;
        collateralId: PromiseOrValue<BigNumberish>;
        collateralAmount: PromiseOrValue<BigNumberish>;
        loanAssetAddress: PromiseOrValue<string>;
        loanAmount: PromiseOrValue<BigNumberish>;
        loanYield: PromiseOrValue<BigNumberish>;
        duration: PromiseOrValue<BigNumberish>;
        expiration: PromiseOrValue<BigNumberish>;
        borrower: PromiseOrValue<string>;
        lender: PromiseOrValue<string>;
        isPersistent: PromiseOrValue<boolean>;
        nonce: PromiseOrValue<BigNumberish>;
    };

    export type OfferStructOutput = [
        number,
        string,
        BigNumber,
        BigNumber,
        string,
        BigNumber,
        BigNumber,
        number,
        number,
        string,
        string,
        boolean,
        BigNumber
    ] & {
        collateralCategory: number;
        collateralAddress: string;
        collateralId: BigNumber;
        collateralAmount: BigNumber;
        loanAssetAddress: string;
        loanAmount: BigNumber;
        loanYield: BigNumber;
        duration: number;
        expiration: number;
        borrower: string;
        lender: string;
        isPersistent: boolean;
        nonce: BigNumber;
    };
}

export interface PwnInterface extends utils.Interface {
    functions: {
        "MAKE_OFFER_PERMISSION_ID()": FunctionFragment;
        "UPGRADE_PLUGIN_PERMISSION_ID()": FunctionFragment;
        "buyOffer((uint8,address,uint256,uint256,address,uint256,uint256,uint32,uint40,address,address,bool,uint256),bytes)": FunctionFragment;
        "dao()": FunctionFragment;
        "implementation()": FunctionFragment;
        "initialize(address,address,address)": FunctionFragment;
        "makeOffer((uint8,address,uint256,uint256,address,uint256,uint256,uint32,uint40,address,address,bool,uint256))": FunctionFragment;
        "pluginType()": FunctionFragment;
        "proxiableUUID()": FunctionFragment;
        "pwnSimpleLoanAddress()": FunctionFragment;
        "pwnSimpleLoanOfferAddress()": FunctionFragment;
        "supportsInterface(bytes4)": FunctionFragment;
        "upgradeTo(address)": FunctionFragment;
        "upgradeToAndCall(address,bytes)": FunctionFragment;
    };

    getFunction(
        nameOrSignatureOrTopic:
            | "MAKE_OFFER_PERMISSION_ID"
            | "UPGRADE_PLUGIN_PERMISSION_ID"
            | "buyOffer"
            | "dao"
            | "implementation"
            | "initialize"
            | "makeOffer"
            | "pluginType"
            | "proxiableUUID"
            | "pwnSimpleLoanAddress"
            | "pwnSimpleLoanOfferAddress"
            | "supportsInterface"
            | "upgradeTo"
            | "upgradeToAndCall"
    ): FunctionFragment;

    encodeFunctionData(
        functionFragment: "MAKE_OFFER_PERMISSION_ID",
        values?: undefined
    ): string;
    encodeFunctionData(
        functionFragment: "UPGRADE_PLUGIN_PERMISSION_ID",
        values?: undefined
    ): string;
    encodeFunctionData(
        functionFragment: "buyOffer",
        values: [IPWNSimpleLoanListOffer.OfferStruct, PromiseOrValue<BytesLike>]
    ): string;
    encodeFunctionData(functionFragment: "dao", values?: undefined): string;
    encodeFunctionData(
        functionFragment: "implementation",
        values?: undefined
    ): string;
    encodeFunctionData(
        functionFragment: "initialize",
        values: [
            PromiseOrValue<string>,
            PromiseOrValue<string>,
            PromiseOrValue<string>
        ]
    ): string;
    encodeFunctionData(
        functionFragment: "makeOffer",
        values: [IPWNSimpleLoanListOffer.OfferStruct]
    ): string;
    encodeFunctionData(
        functionFragment: "pluginType",
        values?: undefined
    ): string;
    encodeFunctionData(
        functionFragment: "proxiableUUID",
        values?: undefined
    ): string;
    encodeFunctionData(
        functionFragment: "pwnSimpleLoanAddress",
        values?: undefined
    ): string;
    encodeFunctionData(
        functionFragment: "pwnSimpleLoanOfferAddress",
        values?: undefined
    ): string;
    encodeFunctionData(
        functionFragment: "supportsInterface",
        values: [PromiseOrValue<BytesLike>]
    ): string;
    encodeFunctionData(
        functionFragment: "upgradeTo",
        values: [PromiseOrValue<string>]
    ): string;
    encodeFunctionData(
        functionFragment: "upgradeToAndCall",
        values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>]
    ): string;

    decodeFunctionResult(
        functionFragment: "MAKE_OFFER_PERMISSION_ID",
        data: BytesLike
    ): Result;
    decodeFunctionResult(
        functionFragment: "UPGRADE_PLUGIN_PERMISSION_ID",
        data: BytesLike
    ): Result;
    decodeFunctionResult(functionFragment: "buyOffer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "dao", data: BytesLike): Result;
    decodeFunctionResult(
        functionFragment: "implementation",
        data: BytesLike
    ): Result;
    decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "makeOffer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pluginType", data: BytesLike): Result;
    decodeFunctionResult(
        functionFragment: "proxiableUUID",
        data: BytesLike
    ): Result;
    decodeFunctionResult(
        functionFragment: "pwnSimpleLoanAddress",
        data: BytesLike
    ): Result;
    decodeFunctionResult(
        functionFragment: "pwnSimpleLoanOfferAddress",
        data: BytesLike
    ): Result;
    decodeFunctionResult(
        functionFragment: "supportsInterface",
        data: BytesLike
    ): Result;
    decodeFunctionResult(functionFragment: "upgradeTo", data: BytesLike): Result;
    decodeFunctionResult(
        functionFragment: "upgradeToAndCall",
        data: BytesLike
    ): Result;

    events: {
        "AdminChanged(address,address)": EventFragment;
        "BeaconUpgraded(address)": EventFragment;
        "Initialized(uint8)": EventFragment;
        "Upgraded(address)": EventFragment;
    };

    getEvent(nameOrSignatureOrTopic: "AdminChanged"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "BeaconUpgraded"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Upgraded"): EventFragment;
}

export interface AdminChangedEventObject {
    previousAdmin: string;
    newAdmin: string;
}
export type AdminChangedEvent = TypedEvent<
    [string, string],
    AdminChangedEventObject
>;

export type AdminChangedEventFilter = TypedEventFilter<AdminChangedEvent>;

export interface BeaconUpgradedEventObject {
    beacon: string;
}
export type BeaconUpgradedEvent = TypedEvent<
    [string],
    BeaconUpgradedEventObject
>;

export type BeaconUpgradedEventFilter = TypedEventFilter<BeaconUpgradedEvent>;

export interface InitializedEventObject {
    version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export interface UpgradedEventObject {
    implementation: string;
}
export type UpgradedEvent = TypedEvent<[string], UpgradedEventObject>;

export type UpgradedEventFilter = TypedEventFilter<UpgradedEvent>;

export interface Pwn extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;

    interface: PwnInterface;

    queryFilter<TEvent extends TypedEvent>(
        event: TypedEventFilter<TEvent>,
        fromBlockOrBlockhash?: string | number | undefined,
        toBlock?: string | number | undefined
    ): Promise<Array<TEvent>>;

    listeners<TEvent extends TypedEvent>(
        eventFilter?: TypedEventFilter<TEvent>
    ): Array<TypedListener<TEvent>>;
    listeners(eventName?: string): Array<Listener>;
    removeAllListeners<TEvent extends TypedEvent>(
        eventFilter: TypedEventFilter<TEvent>
    ): this;
    removeAllListeners(eventName?: string): this;
    off: OnEvent<this>;
    on: OnEvent<this>;
    once: OnEvent<this>;
    removeListener: OnEvent<this>;

    functions: {
        MAKE_OFFER_PERMISSION_ID(overrides?: CallOverrides): Promise<[string]>;

        UPGRADE_PLUGIN_PERMISSION_ID(overrides?: CallOverrides): Promise<[string]>;

        buyOffer(
            offer: IPWNSimpleLoanListOffer.OfferStruct,
            signature: PromiseOrValue<BytesLike>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<ContractTransaction>;

        dao(overrides?: CallOverrides): Promise<[string]>;

        implementation(overrides?: CallOverrides): Promise<[string]>;

        initialize(
            _dao: PromiseOrValue<string>,
            _pwnSimpleLoanOfferAddress: PromiseOrValue<string>,
            _pwnSimpleLoanAddress: PromiseOrValue<string>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<ContractTransaction>;

        makeOffer(
            offer: IPWNSimpleLoanListOffer.OfferStruct,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<ContractTransaction>;

        pluginType(overrides?: CallOverrides): Promise<[number]>;

        proxiableUUID(overrides?: CallOverrides): Promise<[string]>;

        pwnSimpleLoanAddress(overrides?: CallOverrides): Promise<[string]>;

        pwnSimpleLoanOfferAddress(overrides?: CallOverrides): Promise<[string]>;

        supportsInterface(
            _interfaceId: PromiseOrValue<BytesLike>,
            overrides?: CallOverrides
        ): Promise<[boolean]>;

        upgradeTo(
            newImplementation: PromiseOrValue<string>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<ContractTransaction>;

        upgradeToAndCall(
            newImplementation: PromiseOrValue<string>,
            data: PromiseOrValue<BytesLike>,
            overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
        ): Promise<ContractTransaction>;
    };

    MAKE_OFFER_PERMISSION_ID(overrides?: CallOverrides): Promise<string>;

    UPGRADE_PLUGIN_PERMISSION_ID(overrides?: CallOverrides): Promise<string>;

    buyOffer(
        offer: IPWNSimpleLoanListOffer.OfferStruct,
        signature: PromiseOrValue<BytesLike>,
        overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    dao(overrides?: CallOverrides): Promise<string>;

    implementation(overrides?: CallOverrides): Promise<string>;

    initialize(
        _dao: PromiseOrValue<string>,
        _pwnSimpleLoanOfferAddress: PromiseOrValue<string>,
        _pwnSimpleLoanAddress: PromiseOrValue<string>,
        overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    makeOffer(
        offer: IPWNSimpleLoanListOffer.OfferStruct,
        overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    pluginType(overrides?: CallOverrides): Promise<number>;

    proxiableUUID(overrides?: CallOverrides): Promise<string>;

    pwnSimpleLoanAddress(overrides?: CallOverrides): Promise<string>;

    pwnSimpleLoanOfferAddress(overrides?: CallOverrides): Promise<string>;

    supportsInterface(
        _interfaceId: PromiseOrValue<BytesLike>,
        overrides?: CallOverrides
    ): Promise<boolean>;

    upgradeTo(
        newImplementation: PromiseOrValue<string>,
        overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    upgradeToAndCall(
        newImplementation: PromiseOrValue<string>,
        data: PromiseOrValue<BytesLike>,
        overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    callStatic: {
        MAKE_OFFER_PERMISSION_ID(overrides?: CallOverrides): Promise<string>;

        UPGRADE_PLUGIN_PERMISSION_ID(overrides?: CallOverrides): Promise<string>;

        buyOffer(
            offer: IPWNSimpleLoanListOffer.OfferStruct,
            signature: PromiseOrValue<BytesLike>,
            overrides?: CallOverrides
        ): Promise<void>;

        dao(overrides?: CallOverrides): Promise<string>;

        implementation(overrides?: CallOverrides): Promise<string>;

        initialize(
            _dao: PromiseOrValue<string>,
            _pwnSimpleLoanOfferAddress: PromiseOrValue<string>,
            _pwnSimpleLoanAddress: PromiseOrValue<string>,
            overrides?: CallOverrides
        ): Promise<void>;

        makeOffer(
            offer: IPWNSimpleLoanListOffer.OfferStruct,
            overrides?: CallOverrides
        ): Promise<void>;

        pluginType(overrides?: CallOverrides): Promise<number>;

        proxiableUUID(overrides?: CallOverrides): Promise<string>;

        pwnSimpleLoanAddress(overrides?: CallOverrides): Promise<string>;

        pwnSimpleLoanOfferAddress(overrides?: CallOverrides): Promise<string>;

        supportsInterface(
            _interfaceId: PromiseOrValue<BytesLike>,
            overrides?: CallOverrides
        ): Promise<boolean>;

        upgradeTo(
            newImplementation: PromiseOrValue<string>,
            overrides?: CallOverrides
        ): Promise<void>;

        upgradeToAndCall(
            newImplementation: PromiseOrValue<string>,
            data: PromiseOrValue<BytesLike>,
            overrides?: CallOverrides
        ): Promise<void>;
    };

    filters: {
        "AdminChanged(address,address)"(
            previousAdmin?: null,
            newAdmin?: null
        ): AdminChangedEventFilter;
        AdminChanged(
            previousAdmin?: null,
            newAdmin?: null
        ): AdminChangedEventFilter;

        "BeaconUpgraded(address)"(
            beacon?: PromiseOrValue<string> | null
        ): BeaconUpgradedEventFilter;
        BeaconUpgraded(
            beacon?: PromiseOrValue<string> | null
        ): BeaconUpgradedEventFilter;

        "Initialized(uint8)"(version?: null): InitializedEventFilter;
        Initialized(version?: null): InitializedEventFilter;

        "Upgraded(address)"(
            implementation?: PromiseOrValue<string> | null
        ): UpgradedEventFilter;
        Upgraded(
            implementation?: PromiseOrValue<string> | null
        ): UpgradedEventFilter;
    };

    estimateGas: {
        MAKE_OFFER_PERMISSION_ID(overrides?: CallOverrides): Promise<BigNumber>;

        UPGRADE_PLUGIN_PERMISSION_ID(overrides?: CallOverrides): Promise<BigNumber>;

        buyOffer(
            offer: IPWNSimpleLoanListOffer.OfferStruct,
            signature: PromiseOrValue<BytesLike>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<BigNumber>;

        dao(overrides?: CallOverrides): Promise<BigNumber>;

        implementation(overrides?: CallOverrides): Promise<BigNumber>;

        initialize(
            _dao: PromiseOrValue<string>,
            _pwnSimpleLoanOfferAddress: PromiseOrValue<string>,
            _pwnSimpleLoanAddress: PromiseOrValue<string>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<BigNumber>;

        makeOffer(
            offer: IPWNSimpleLoanListOffer.OfferStruct,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<BigNumber>;

        pluginType(overrides?: CallOverrides): Promise<BigNumber>;

        proxiableUUID(overrides?: CallOverrides): Promise<BigNumber>;

        pwnSimpleLoanAddress(overrides?: CallOverrides): Promise<BigNumber>;

        pwnSimpleLoanOfferAddress(overrides?: CallOverrides): Promise<BigNumber>;

        supportsInterface(
            _interfaceId: PromiseOrValue<BytesLike>,
            overrides?: CallOverrides
        ): Promise<BigNumber>;

        upgradeTo(
            newImplementation: PromiseOrValue<string>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<BigNumber>;

        upgradeToAndCall(
            newImplementation: PromiseOrValue<string>,
            data: PromiseOrValue<BytesLike>,
            overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
        ): Promise<BigNumber>;
    };

    populateTransaction: {
        MAKE_OFFER_PERMISSION_ID(
            overrides?: CallOverrides
        ): Promise<PopulatedTransaction>;

        UPGRADE_PLUGIN_PERMISSION_ID(
            overrides?: CallOverrides
        ): Promise<PopulatedTransaction>;

        buyOffer(
            offer: IPWNSimpleLoanListOffer.OfferStruct,
            signature: PromiseOrValue<BytesLike>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<PopulatedTransaction>;

        dao(overrides?: CallOverrides): Promise<PopulatedTransaction>;

        implementation(overrides?: CallOverrides): Promise<PopulatedTransaction>;

        initialize(
            _dao: PromiseOrValue<string>,
            _pwnSimpleLoanOfferAddress: PromiseOrValue<string>,
            _pwnSimpleLoanAddress: PromiseOrValue<string>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<PopulatedTransaction>;

        makeOffer(
            offer: IPWNSimpleLoanListOffer.OfferStruct,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<PopulatedTransaction>;

        pluginType(overrides?: CallOverrides): Promise<PopulatedTransaction>;

        proxiableUUID(overrides?: CallOverrides): Promise<PopulatedTransaction>;

        pwnSimpleLoanAddress(
            overrides?: CallOverrides
        ): Promise<PopulatedTransaction>;

        pwnSimpleLoanOfferAddress(
            overrides?: CallOverrides
        ): Promise<PopulatedTransaction>;

        supportsInterface(
            _interfaceId: PromiseOrValue<BytesLike>,
            overrides?: CallOverrides
        ): Promise<PopulatedTransaction>;

        upgradeTo(
            newImplementation: PromiseOrValue<string>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<PopulatedTransaction>;

        upgradeToAndCall(
            newImplementation: PromiseOrValue<string>,
            data: PromiseOrValue<BytesLike>,
            overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
        ): Promise<PopulatedTransaction>;
    };
}
