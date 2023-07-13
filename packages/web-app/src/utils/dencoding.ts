//TODO: Move to our own sdk
import { bytesToHex } from "@aragon/sdk-common";
import { CreditDelegator__factory } from "typechain-types/CreditDelegator__factory";
import { ActionCreditDelegation, InterestRateType } from "./types"
import {
    getFunctionFragment,
  } from "@aragon/sdk-client-common";
import { AVAILABLE_FUNCTION_SIGNATURES } from "./constants";

export const decodeCreditDelegationAction = async (data: Uint8Array): Promise<ActionCreditDelegation | undefined> => {

    const iface = CreditDelegator__factory.createInterface()
    const hexBytes = bytesToHex(data)

    const expectedfunction = iface.getFunction("borrowAndTransfer");
    const result = iface.decodeFunctionData(
        expectedfunction,
        hexBytes,
    );

    return {
        name: "credit_delegation",
        inputs: {
            amount: Number(result[1]),
            interestRateType: Number([result[2]]) == 2 ? InterestRateType.VARIABLE : InterestRateType.STABLE,
            token: result[0],
            user: result[5]
        }
    }
}

export const findInterfaceCustomPlugins = (data: Uint8Array) => {
    try {
      const func = getFunctionFragment(data, AVAILABLE_FUNCTION_SIGNATURES);
      return {
        id: func.format("minimal"),
        functionName: func.name,
        hash: bytesToHex(data).substring(0, 10),
      };
    } catch {
      return null;
    }
  }
