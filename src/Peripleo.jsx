import React from 'react';
import { RecoilRoot } from 'recoil';
import { MapProvider, useMap as useOneOfManyMaps  } from 'react-map-gl';
import { Search, SearchProvider } from './search';

// react-map-gl has a utility hook that supports
// multiple child maps, and one parent map. We want
// a simplified hook which assumes only a single
// map inside the Peripleo tag.
export const useMap = () => {
  const { current, ...maps } = useOneOfManyMaps();
  return Object.values(maps)[0];
}

const Peripleo = props => {

  return (
    <RecoilRoot>
      <SearchProvider initialSearch={Search.all()}>
        <MapProvider>
          {props.children}
        </MapProvider>
      </SearchProvider>
    </RecoilRoot>
  )

}

export default Peripleo;