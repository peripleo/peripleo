import React from 'react';
import { RecoilRoot } from 'recoil';
import { MapProvider } from 'react-map-gl';

type PeripleoProps = {

  children: React.ReactElement 

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
      <MapProvider>
        {props.children}
      </MapProvider>
    </RecoilRoot>
  )

}

export default Peripleo;