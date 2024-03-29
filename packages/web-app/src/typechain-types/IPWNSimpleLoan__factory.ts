/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IPWNSimpleLoan,
  IPWNSimpleLoanInterface,
} from "./IPWNSimpleLoan";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "loanTermsFactoryContract",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "loanTermsFactoryData",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "loanAssetPermit",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "collateralPermit",
        type: "bytes",
      },
    ],
    name: "createLOAN",
    outputs: [
      {
        internalType: "uint256",
        name: "loanId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IPWNSimpleLoan__factory {
  static readonly abi = _abi;
  static createInterface(): IPWNSimpleLoanInterface {
    return new utils.Interface(_abi) as IPWNSimpleLoanInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IPWNSimpleLoan {
    return new Contract(address, _abi, signerOrProvider) as IPWNSimpleLoan;
  }
}
