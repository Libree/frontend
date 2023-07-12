import React from 'react';

import SelectChainDetails from './selectChainDetails';
import DefineMetadataDetails from './defineMetadataDetails';

const CommunityDetailsSetup: React.FC = () => {
    return (
        <>
            <SelectChainDetails />
            <DefineMetadataDetails />
        </>
    );
};

export default CommunityDetailsSetup;
