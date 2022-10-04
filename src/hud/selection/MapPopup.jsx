import React from 'react';
import { WebMercatorViewport } from '@deck.gl/core';
import { useRecoilState } from 'recoil';
import { mapViewState, selectedState } from '../../state';

export const MapPopup = props => {

  const [viewState, setViewState] = useRecoilState(mapViewState);

  const [selected, setSelected] = useRecoilState(selectedState);

  console.log(selected);

  return selected ? (
    <div className='p6o-map-popup-container'>
      Hello World
    </div>
  ) : null;

}