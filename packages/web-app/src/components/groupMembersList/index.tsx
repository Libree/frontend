import { Erc20TokenDetails } from '@aragon/sdk-client';
import { AvatarWallet, IconPerson, IconRadioCancel, IconRemove, IsAddress, ListItemAction, ListItemAddressProps, shortenAddress } from '@aragon/ui-components';
import { formatUnits } from 'ethers/lib/utils';
import React, { FC, useEffect, useState } from 'react';

import { useNetwork } from 'context/network';
import { useSpecificProvider } from 'context/providers';
import { CHAIN_METADATA } from 'utils/constants';
import { getTokenInfo } from 'utils/tokens';
import { constants } from 'ethers';

type GroupMembersListProps = {
    members: Array<any>;
    token?: Erc20TokenDetails;
};

export const GroupMembersList: React.FC<GroupMembersListProps> = ({ token, members }) => {
    const { network } = useNetwork();
    const [totalSupply, setTotalSupply] = useState<number>(0);

    const provider = useSpecificProvider(CHAIN_METADATA[network].id);

    useEffect(() => {
        async function fetchTotalSupply() {
            if (token) {
                const { totalSupply: supply, decimals } = await getTokenInfo(
                    token.address,
                    provider,
                    CHAIN_METADATA[network].nativeCurrency
                );
                setTotalSupply(Number(formatUnits(supply, decimals)));
            }
        }
        fetchTotalSupply();
    }, [provider, token, network]);

    return (
        <>
            {members.map(member => {
                return (
                    <ListItemAction
                        key={member.address}
                        title={shortenAddress(member.address)}
                        iconLeft={<><Avatar src={''} /></>}
                        iconRight={
                            <div onClick={() => {}}>
                                <IconRadioCancel />
                            </div>
                        }
                        bgWhite
                    />
                );
            })}
        </>
    );
};

type AvatarProps = Pick<ListItemAddressProps, 'src'>;

const Avatar: FC<AvatarProps> = ({ src }) => {
    if (!src) return <IconPerson className="w-2.5 h-2.5" />;
    return <AvatarWallet src={IsAddress(src) ? src : constants.AddressZero} />;
};
