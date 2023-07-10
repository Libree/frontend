//TODO: Move to our own sdk
import { bytesToHex } from "@aragon/sdk-common";
import { CreditDelegator__factory } from "typechain-types/CreditDelegator__factory";
import { ActionCreditDelegation } from "./types";

export const decodeCreditDelegationAction = async (data: Uint8Array): Promise<ActionCreditDelegation | undefined> => {

    const iface = CreditDelegator__factory.createInterface()
    const hexBytes = bytesToHex(data)

    const expectedfunction = iface.getFunction("borrowAndTransfer");
    const result = iface.decodeFunctionData(
        expectedfunction,
        hexBytes,
    );

    const values = result[0]

    return {
        name: "credit_delegation",
        inputs: {
            amount: Number(values[1]),
            interestRateType: values[2],
            token: values[0],
            user: values[5]
        }
    }
}
