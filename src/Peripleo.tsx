import React from 'react';
import { RecoilRoot } from 'recoil';
import { MapProvider } from 'react-map-gl';
import { DeviceStateContextProvider } from './device';

type PeripleoProps = {

  children: React.ReactElement 

  breakPoint?: number

}

// Peripleo acts as a context provider. Every component
// inside Peripleo:
// 
// - has access to the map
// - can access central Recoil state
// - can use all Peripleo-specific hooks (which might depend on map or state)
const Peripleo = (props: PeripleoProps) => {

  return (
    <RecoilRoot>
      <DeviceStateContextProvider breakPoint={props.breakPoint || 540}>
        <MapProvider>
          {props.children}
        </MapProvider>
      </DeviceStateContextProvider>
    </RecoilRoot>
  )

}

export default Peripleo;