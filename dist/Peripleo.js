import React from 'react';
import { RecoilRoot } from 'recoil';
import { MapProvider } from 'react-map-gl';
import { DeviceStateContextProvider } from './device';
// Peripleo acts as a context provider. Every component
// inside Peripleo:
// 
// - has access to the map
// - can access central Recoil state
// - can use all Peripleo-specific hooks (which might depend on map or state)
const Peripleo = (props) => {
    return (React.createElement(RecoilRoot, null,
        React.createElement(DeviceStateContextProvider, { breakPoint: props.breakPoint || 540 },
            React.createElement(MapProvider, null, props.children))));
};
export default Peripleo;
//# sourceMappingURL=Peripleo.js.map