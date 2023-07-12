import React from 'react';

import CreateNewToken from 'containers/setupCommunity/createNewToken';
import SelectPlugins from 'containers/selectPlugins';

const CommunityTokenSetup: React.FC = () => {
    return (
        <>
            <CreateNewToken />

            <SelectPlugins />
        </>
    );
};

export default CommunityTokenSetup;
