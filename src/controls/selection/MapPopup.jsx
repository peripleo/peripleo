import React, { useEffect, useState } from 'react';
import centroid from '@turf/centroid';
import { WebMercatorViewport } from '@deck.gl/core';
import { useRecoilState } from 'recoil';
import { mapViewState, selectedState } from '../../state';

export const MapPopup = props => {

  const [viewState, setViewState] = useRecoilState(mapViewState);

  const [selected, setSelected] = useRecoilState(selectedState);

  const [left, setLeft] = useState();
  
  const [top, setTop] = useState();

  useEffect(() => {
    if (selected) {
      const { feature } = selected;
      const lonlat = centroid(feature)?.geometry.coordinates;

      const viewport = new WebMercatorViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        ...viewState
      });

      const [left, top] = viewport.project(lonlat);
      setLeft(left);
      setTop(top);
    }
  }, [viewState, selected]);

  return selected && (
    <div 
      className="p6o-map-popup-container"
      style={{ left, top, position: 'absolute' }}>
      Hello World
    </div>
  );

}