import {
    ButtonText,
    IconChevronRight,
    IconGovernance,
    ListItemHeader,
} from '@aragon/ui-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { StateEmpty } from 'components/stateEmpty';
import { useNetwork } from 'context/network';
import { Governance } from 'utils/paths';
import { ProposalListItem } from 'utils/types';
import useScreen from 'hooks/useScreen';

type Props = {
    daoAddressOrEns: string;
    proposals?: ProposalListItem[];
};

const NFTOverview: React.FC<Props> = ({
    daoAddressOrEns,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { network } = useNetwork();
    const { isMobile } = useScreen();

    let nfts: any[] = [
        {
            id: 1,
            title: 'NFT 1',
            description: 'NFT 1 description',
            imgUrl: 'https://picsum.photos/200/300',
        },
        {
            id: 2,
            title: 'NFT 2',
            description: 'NFT 2 description',
            imgUrl: 'https://picsum.photos/200/300',
        },
        {
            id: 3,
            title: 'NFT 3',
            description: 'NFT 3 description',
            imgUrl: 'https://picsum.photos/200/300',
        },
        {
            id: 4,
            title: 'NFT 4',
            description: 'NFT 4 description',
            imgUrl: 'https://picsum.photos/200/300',
        },
        {
            id: 5,
            title: 'NFT 5',
            description: 'NFT 5 description',
            imgUrl: 'https://picsum.photos/200/300',
        },
        {
            id: 6,
            title: 'NFT 6',
            description: 'NFT 6 description',
            imgUrl: 'https://picsum.photos/200/300',
        },
        {
            id: 7,
            title: 'NFT 7',
            description: 'NFT 7 description',
            imgUrl: 'https://picsum.photos/200/300',
        },
        {
            id: 8,
            title: 'NFT 8',
            description: 'NFT 8 description',
            imgUrl: 'https://picsum.photos/200/300',
        }
    ];

    if (nfts.length === 0) {
        return (
            <StateEmpty
                type="Object"
                mode='card'
                object="smart_contract"
                title={t('dashboard.nftOverview.noNFTs')}
                description={t('dashboard.nftOverview.noNFTsDescription')}
            />
        );
    }

    return (
        <Container>
            <ListItemHeader
                icon={<IconGovernance />}
                value={t('dashboard.nftOverview.title')}
                label={''}
                orientation="horizontal"
            />

            <CardsDisplay>
                {nfts.slice(0, isMobile ? 4 : 6).map(nft => (
                    <Card>
                        <CardContent>
                            <StyledImg src={nft.imgUrl} />
                            <TextContent>
                                <Title>{nft.title}</Title>
                                {!isMobile && <Description>{nft.description}</Description>}
                            </TextContent>
                        </CardContent>
                    </Card>
                ))}
            </CardsDisplay>

            <ButtonText
                mode="secondary"
                size="large"
                iconRight={<IconChevronRight />}
                label={t('labels.seeAll')}
                onClick={() =>
                    navigate(generatePath(Governance, { network, dao: daoAddressOrEns }))
                }
            />
        </Container>
    );
};

export default NFTOverview;

const Container = styled.div.attrs({
    className: 'space-y-1.5 desktop:space-y-2 w-full',
})``;

const CardsDisplay = styled.div.attrs({
    className: 'grid grid-cols-2 tablet:grid-cols-3 gap-1 tablet:gap-2',
})``;

const Card = styled.div.attrs({
    className:
        'w-full bg-white rounded-xl p-1 tablet:p-2 space-y-1 box-border ' +
        'hover:border hover:border-ui-100 ' +
        'active:border active:border-ui-200 ' +
        'focus:outline-none focus:ring-2 focus:ring-primary-500',
})`
  &:hover {
    box-shadow: 0px 4px 8px rgba(31, 41, 51, 0.04),
      0px 0px 2px rgba(31, 41, 51, 0.06), 0px 0px 1px rgba(31, 41, 51, 0.04);
  }
`;

const CardContent = styled.div.attrs({
    className: 'relative w-full h-16'
})``;

const StyledImg = styled.img.attrs({
    className: 'w-full h-full rounded-xl object-cover'
})``;

const TextContent = styled.div.attrs({
    className: 'absolute bottom-0 flex flex-col items-left bg-white opacity-80 w-full h-fit-content p-1 tablet:py-0 rounded-b-xl',
})``;

const Title = styled.p.attrs({
    className: 'text-ui-800 text-left font-bold',
})``;

const Description = styled.p.attrs({
    className: 'text-ui-600 text-left font-normal ft-text-sm line-clamp-2',
})``;
