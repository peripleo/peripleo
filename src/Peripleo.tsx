import React from 'react';
import { RecoilRoot } from 'recoil';
import { MapProvider, useMap as useOneOfManyMaps } from 'react-map-gl';

// react-map-gl has a utility hook that supports
// multiple child maps, and one parent map. We want
// a simplified hook which assumes only a single
// map inside the Peripleo tag.
export const useMap = () => {
  const { current, ...maps } = useOneOfManyMaps();
  return Object.values(maps)[0];
}

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