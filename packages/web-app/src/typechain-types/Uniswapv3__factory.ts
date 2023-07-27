/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "./common";
import type {
  Uniswapv3,
  Uniswapv3Interface,
} from "./Uniswapv3";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "dao",
        type: "address",
      },
      {
        internalType: "address",
        name: "where",
        type: "address",
      },
      {
        internalType: "address",
        name: "who",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "permissionId",
        type: "bytes32",
      },
    ],
    name: "DaoUnauthorized",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "beacon",
        type: "address",
      },
    ],
    name: "BeaconUpgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    inputs: [],
    name: "PROVIDE_LIQUIDITY_PERMISSION_ID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SWAP_PERMISSION_ID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "UPGRADE_PLUGIN_PERMISSION_ID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "dao",
    outputs: [
      {
        internalType: "contract IDAO",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "implementation",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IDAO",
        name: "_dao",
        type: "address",
      },
      {
        internalType: "address",
        name: "_uniswapRouterAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_nonfungiblePositionManagerAddress",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "nonfungiblePositionManagerAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pluginType",
    outputs: [
      {
        internalType: "enum IPlugin.PluginType",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token0",
        type: "address",
      },
      {
        internalType: "address",
        name: "token1",
        type: "address",
      },
      {
        internalType: "uint24",
        name: "fee",
        type: "uint24",
      },
      {
        internalType: "int24",
        name: "tickLower",
        type: "int24",
      },
      {
        internalType: "int24",
        name: "tickUpper",
        type: "int24",
      },
      {
        internalType: "uint256",
        name: "amount0Desired",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1Desired",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount0Min",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1Min",
        type: "uint256",
      },
    ],
    name: "provideLiquidity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "_interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenIn",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenOut",
        type: "address",
      },
      {
        internalType: "uint24",
        name: "fee",
        type: "uint24",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountOutMinimum",
        type: "uint256",
      },
      {
        internalType: "uint160",
        name: "sqrtPriceLimitX96",
        type: "uint160",
      },
    ],
    name: "swap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "uniswapRouterAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60a06040523060805234801561001457600080fd5b5061001d610022565b6100e2565b600054610100900460ff161561008e5760405162461bcd60e51b815260206004820152602760248201527f496e697469616c697a61626c653a20636f6e747261637420697320696e697469604482015266616c697a696e6760c81b606482015260840160405180910390fd5b60005460ff90811610156100e0576000805460ff191660ff9081179091556040519081527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b565b6080516117bd6101196000396000818161035b015281816103a40152818161042c0152818161046c01526104e801526117bd6000f3fe6080604052600436106100c85760003560e01c80634f1ef2861161007a5780634f1ef2861461020d57806352d1902d146102205780635bfccac9146102355780635c60da1b1461025657806366a264e41461026b5780637b2a667c1461028b578063c0c53b8b146102ab578063c9c4bfca146102cb57600080fd5b806301ffc9a7146100cd57806307d86f531461010257806320ca3c7f14610144578063316374bc1461017d5780633659cfe6146101b15780634162169f146101d357806341de6830146101f1575b600080fd5b3480156100d957600080fd5b506100ed6100e836600461119b565b6102ff565b60405190151581526020015b60405180910390f35b34801561010e57600080fd5b506101367f9167111a3a64020f1afcbdfdfed46fb61aabacd37401ba2175af9c698997c07681565b6040519081526020016100f9565b34801561015057600080fd5b5061012d54610165906001600160a01b031681565b6040516001600160a01b0390911681526020016100f9565b34801561018957600080fd5b506101367f07d42bc942d260c7ad99db2af93910651962e0e75abae67a0466baf9f424ffa181565b3480156101bd57600080fd5b506101d16101cc3660046111da565b610351565b005b3480156101df57600080fd5b5060c9546001600160a01b0316610165565b3480156101fd57600080fd5b5060006040516100f991906111f7565b6101d161021b366004611235565b610422565b34801561022c57600080fd5b506101366104db565b34801561024157600080fd5b5061012e54610165906001600160a01b031681565b34801561026257600080fd5b50610165610589565b34801561027757600080fd5b506101d1610286366004611323565b610598565b34801561029757600080fd5b506101d16102a63660046113b1565b610832565b3480156102b757600080fd5b506101d16102c6366004611433565b610aaf565b3480156102d757600080fd5b506101367f821b6e3a557148015a918c89e5d092e878a69854a2d1a410635f771bd5a8a3f581565b60006001600160e01b0319821663041de68360e41b148061033057506001600160e01b031982166352d1902d60e01b145b8061034b57506301ffc9a760e01b6001600160e01b03198316145b92915050565b6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001630036103a25760405162461bcd60e51b81526004016103999061147e565b60405180910390fd5b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166103d4610bf6565b6001600160a01b0316146103fa5760405162461bcd60e51b8152600401610399906114ca565b61040381610c12565b6040805160008082526020820190925261041f91839190610c4b565b50565b6001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016300361046a5760405162461bcd60e51b81526004016103999061147e565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661049c610bf6565b6001600160a01b0316146104c25760405162461bcd60e51b8152600401610399906114ca565b6104cb82610c12565b6104d782826001610c4b565b5050565b6000306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146105765760405162461bcd60e51b815260206004820152603860248201527f555550535570677261646561626c653a206d757374206e6f742062652063616c6044820152771b1959081d1a1c9bdd59da0819195b1959d85d1958d85b1b60421b6064820152608401610399565b5060008051602061174183398151915290565b6000610593610bf6565b905090565b60c9547f9167111a3a64020f1afcbdfdfed46fb61aabacd37401ba2175af9c698997c076906105d6906001600160a01b031630335b84600036610dbb565b61012e5460405163095ea7b360e01b81526001600160a01b038c81169263095ea7b39261060b92909116908990600401611516565b6020604051808303816000875af115801561062a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061064e919061152f565b5061012e5460405163095ea7b360e01b81526001600160a01b038b81169263095ea7b39261068492909116908890600401611516565b6020604051808303816000875af11580156106a3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106c7919061152f565b5060006040518061016001604052808c6001600160a01b031681526020018b6001600160a01b031681526020018a62ffffff1681526020018960020b81526020018860020b8152602001878152602001868152602001600081526020016000815260200161073d60c9546001600160a01b031690565b6001600160a01b0316815260200142815250905060006107d861012e60009054906101000a90046001600160a01b031660007f88316456ea4eb762522032f7a1c5897e22bfe070ad8c1ef6d6cb98fb9c7c26f2856040516024016107a19190611551565b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152610e77565b509050806108245760405162461bcd60e51b81526020600482015260196024820152784572726f722070726f766964696e67206c697175696469747960381b6044820152606401610399565b505050505050505050505050565b60c9547f07d42bc942d260c7ad99db2af93910651962e0e75abae67a0466baf9f424ffa19061086b906001600160a01b031630336105cd565b876001600160a01b03166323b872dd61088c60c9546001600160a01b031690565b6040516001600160e01b031960e084901b1681526001600160a01b039091166004820152306024820152604481018790526064016020604051808303816000875af11580156108df573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610903919061152f565b5061012d5460405163095ea7b360e01b81526001600160a01b038a81169263095ea7b39261093992909116908890600401611516565b6020604051808303816000875af1158015610958573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061097c919061152f565b5060408051610100810182526001600160a01b03808b168083528a82166020840190815262ffffff808c168587019081528b851660608701908152426080880190815260a088018d815260c089018d81528c891660e08b0190815261012d549b516024810199909952965189166044890152935190941660648701529051861660848601525160a4850152905160c48401525160e48301525182166101048201529192600092610a5892919091169083907f414bf389314e949f7d65d58dd6b67d69018994750e6fdc230761f1010efe499390610124016107a1565b50905080610aa35760405162461bcd60e51b815260206004820152601860248201527704572726f7220657865637574696e672074686520737761760441b6044820152606401610399565b50505050505050505050565b600054610100900460ff1615808015610acf5750600054600160ff909116105b80610ae95750303b158015610ae9575060005460ff166001145b610b4c5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608401610399565b6000805460ff191660011790558015610b6f576000805461ff0019166101001790555b610b7884610ee3565b61012d80546001600160a01b038086166001600160a01b03199283161790925561012e8054928516929091169190911790558015610bf0576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b50505050565b600080516020611741833981519152546001600160a01b031690565b60c9547f821b6e3a557148015a918c89e5d092e878a69854a2d1a410635f771bd5a8a3f5906104d7906001600160a01b031630336105cd565b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd91435460ff1615610c8357610c7e83610f13565b505050565b826001600160a01b03166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa925050508015610cdd575060408051601f3d908101601f19168201909252610cda91810190611615565b60015b610d405760405162461bcd60e51b815260206004820152602e60248201527f45524331393637557067726164653a206e657720696d706c656d656e7461746960448201526d6f6e206973206e6f74205555505360901b6064820152608401610399565b6000805160206117418339815191528114610daf5760405162461bcd60e51b815260206004820152602960248201527f45524331393637557067726164653a20756e737570706f727465642070726f786044820152681a58589b195555525160ba1b6064820152608401610399565b50610c7e838383610faf565b604051637ef7c88360e11b81526001600160a01b0387169063fdef910690610def908890889088908890889060040161162e565b602060405180830381865afa158015610e0c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e30919061152f565b610e6f57604051630cb6f8ed60e21b81526001600160a01b03808816600483015280871660248301528516604482015260648101849052608401610399565b505050505050565b60006060846001600160a01b03168484604051610e9491906116a6565b60006040518083038185875af1925050503d8060008114610ed1576040519150601f19603f3d011682016040523d82523d6000602084013e610ed6565b606091505b5091509150935093915050565b600054610100900460ff16610f0a5760405162461bcd60e51b8152600401610399906116c2565b61041f81610fd4565b6001600160a01b0381163b610f805760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608401610399565b60008051602061174183398151915280546001600160a01b0319166001600160a01b0392909216919091179055565b610fb88361101d565b600082511180610fc55750805b15610c7e57610bf0838361105d565b600054610100900460ff16610ffb5760405162461bcd60e51b8152600401610399906116c2565b60c980546001600160a01b0319166001600160a01b0392909216919091179055565b61102681610f13565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b60606001600160a01b0383163b6110c55760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b6064820152608401610399565b600080846001600160a01b0316846040516110e091906116a6565b600060405180830381855af49150503d806000811461111b576040519150601f19603f3d011682016040523d82523d6000602084013e611120565b606091505b5091509150611148828260405180606001604052806027815260200161176160279139611151565b95945050505050565b6060831561116057508161116a565b61116a8383611171565b9392505050565b8151156111815781518083602001fd5b8060405162461bcd60e51b8152600401610399919061170d565b6000602082840312156111ad57600080fd5b81356001600160e01b03198116811461116a57600080fd5b6001600160a01b038116811461041f57600080fd5b6000602082840312156111ec57600080fd5b813561116a816111c5565b602081016003831061121957634e487b7160e01b600052602160045260246000fd5b91905290565b634e487b7160e01b600052604160045260246000fd5b6000806040838503121561124857600080fd5b8235611253816111c5565b9150602083013567ffffffffffffffff8082111561127057600080fd5b818501915085601f83011261128457600080fd5b8135818111156112965761129661121f565b604051601f8201601f19908116603f011681019083821181831017156112be576112be61121f565b816040528281528860208487010111156112d757600080fd5b8260208601602083013760006020848301015280955050505050509250929050565b803562ffffff8116811461130c57600080fd5b919050565b8035600281900b811461130c57600080fd5b60008060008060008060008060006101208a8c03121561134257600080fd5b893561134d816111c5565b985060208a013561135d816111c5565b975061136b60408b016112f9565b965061137960608b01611311565b955061138760808b01611311565b989b979a50959894979660a0860135965060c08601359560e0810135955061010001359350915050565b600080600080600080600060e0888a0312156113cc57600080fd5b87356113d7816111c5565b965060208801356113e7816111c5565b95506113f5604089016112f9565b94506060880135611405816111c5565b93506080880135925060a0880135915060c0880135611423816111c5565b8091505092959891949750929550565b60008060006060848603121561144857600080fd5b8335611453816111c5565b92506020840135611463816111c5565b91506040840135611473816111c5565b809150509250925092565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b6001600160a01b03929092168252602082015260400190565b60006020828403121561154157600080fd5b8151801515811461116a57600080fd5b81516001600160a01b031681526101608101602083015161157d60208401826001600160a01b03169052565b506040830151611594604084018262ffffff169052565b5060608301516115a9606084018260020b9052565b5060808301516115be608084018260020b9052565b5060a083015160a083015260c083015160c083015260e083015160e083015261010080840151818401525061012080840151611604828501826001600160a01b03169052565b505061014092830151919092015290565b60006020828403121561162757600080fd5b5051919050565b6001600160a01b038681168252851660208201526040810184905260806060820181905281018290526000828460a0840137600060a0848401015260a0601f19601f85011683010190509695505050505050565b60005b8381101561169d578181015183820152602001611685565b50506000910152565b600082516116b8818460208701611682565b9190910192915050565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b602081526000825180602084015261172c816040850160208701611682565b601f01601f1916919091016040019291505056fe360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a2646970667358221220f140f95176f7832e83afd441e8d5fdc039917244caba5a638191c7b68bfc898d64736f6c63430008110033";

type Uniswapv3ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: Uniswapv3ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Uniswapv3__factory extends ContractFactory {
  constructor(...args: Uniswapv3ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Uniswapv3> {
    return super.deploy(overrides || {}) as Promise<Uniswapv3>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Uniswapv3 {
    return super.attach(address) as Uniswapv3;
  }
  override connect(signer: Signer): Uniswapv3__factory {
    return super.connect(signer) as Uniswapv3__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): Uniswapv3Interface {
    return new utils.Interface(_abi) as Uniswapv3Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Uniswapv3 {
    return new Contract(address, _abi, signerOrProvider) as Uniswapv3;
  }
}