//TODO: Move to our own sdk
import { bytesToHex, hexToBytes } from "@aragon/sdk-common";
import { CreditDelegator__factory } from "typechain-types/CreditDelegator__factory";
import { Subgovernance__factory } from "typechain-types/Subgovernance__factory";
import { Action, ActionAddMember, ActionCreditDelegation, InterestRateType } from "./types"
import {
  getFunctionFragment
} from "@aragon/sdk-client-common";
import { AVAILABLE_FUNCTION_SIGNATURES, CHAIN_METADATA, SupportedNetworks } from "./constants";
import {
  DaoAction
} from '@aragon/sdk-client-common';
import { ethers } from "ethers";
import { getTokenInfo } from "./tokens";

export const decodeCreditDelegationAction = async (
  data: Uint8Array,
  isGrouped: boolean,
  provider: any,
  network: SupportedNetworks
): Promise<ActionCreditDelegation | undefined> => {

  const iface = CreditDelegator__factory.createInterface()
  const hexBytes = bytesToHex(data)

  const expectedfunction = iface.getFunction("borrowAndTransfer");
  const result = iface.decodeFunctionData(
    expectedfunction,
    isGrouped ? data : hexBytes,
  );

  let tokenInfo;

  if (provider) {
    tokenInfo = await getTokenInfo(
      result[0],
      provider,
      CHAIN_METADATA[network].nativeCurrency
    )
  }

  return {
    name: "credit_delegation",
    inputs: {
      amount: Number(result[1]) / Math.pow(10, tokenInfo?.decimals || 18),
      interestRateType: Number([result[2]]) == 2 ? InterestRateType.VARIABLE : InterestRateType.STABLE,
      token: result[0],
      user: result[5]
    }
  }
}


export const decodeGroupedActions = (data: Uint8Array): DaoAction[] | undefined => {
  try {
    const iface = CreditDelegator__factory.createInterface()
    const hexBytes = bytesToHex(data)

    const expectedfunction = iface.getFunction("registerActions");
    const result = iface.decodeFunctionData(
      expectedfunction,
      hexBytes,
    );

    return result['_actions']

  } catch (error) {

  }
}


export const decodeCreateGroupAction = async (data: Uint8Array): Promise<Action[] | undefined> => {
  const iface = Subgovernance__factory.createInterface()
  const hexBytes = bytesToHex(data)

  const expectedfunction = iface.getFunction("createGroup");
  const result = iface.decodeFunctionData(
    expectedfunction,
    hexBytes,
  );

  const groupName = result['_groupName']
  const members = result['_members']
  let memberActions: ActionAddMember[] = []

  for (let i = 0; i < members.length; i++) {
    memberActions.push(
      {
        name: "add_member",
        inputs: {
          address: members[i]
        }
      }
    )
  }

  return [{
    name: "create_group",
    inputs: {
      groupName
    }
  },
  ...memberActions
  ]
}

export const findInterfaceCustomPlugins = (data: Uint8Array, isGrouped: boolean = false) => {
  const decodeData = isGrouped ? hexToBytes(data.toString()) : data

  try {
    const func = getFunctionFragment(decodeData, AVAILABLE_FUNCTION_SIGNATURES);
    return {
      id: func.format("minimal"),
      functionName: func.name,
      hash: bytesToHex(data).substring(0, 10),
    };
  } catch {
    return null;
  }
}
