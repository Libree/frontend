import { useInstalledPlugins } from './useInstalledPlugins';
import { useWallet } from 'hooks/useWallet';
import { useEffect, useState } from 'react';
import { Subgovernance__factory } from 'typechain-types/Subgovernance__factory';
import { Subgovernance } from 'typechain-types/Subgovernance';

export interface IGroupData {
  id: number,
  name: string
}

export interface IuseSubgovernance {
  groupData: (IGroupData | undefined)[]
}

export function useSubgovernance(daoAddress?: string): IuseSubgovernance {
  const { subgovernance } = useInstalledPlugins(daoAddress)
  const { signer } = useWallet();

  const [subgovernancePlugin, setSubgovernancePlugin] = useState<Subgovernance | null>(null)
  const [groupData, setGroupData] = useState<(IGroupData | undefined)[]>([])

  useEffect(() => {
    if (signer && subgovernance) {
      const factory = new Subgovernance__factory().connect(signer);
      setSubgovernancePlugin(factory.attach(subgovernance.instanceAddress));
    }
  }, [signer, subgovernance])


  useEffect(() => {
    if (subgovernancePlugin) {
      getGroupsNames()
    }

  }, [subgovernancePlugin])

  const getGroupsNames = async () => {
    const groupsCount = Number(await subgovernancePlugin?._groupIdCounter())
    let groupData = []

    for(let i=0; i<groupsCount; i++ ){
      const name = await subgovernancePlugin?.getGroupName(i)
      groupData.push({id: i, name } as IGroupData)
    }
   const data =  await Promise.all(groupData)
   setGroupData(data)
  }

  return {
    groupData
  };
}
