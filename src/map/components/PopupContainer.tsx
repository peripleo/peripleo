import React, { useEffect, useState } from 'react';
import { MapRef, LngLatLike } from 'react-map-gl';
import centroid from '@turf/centroid';
import { AllGeoJSON } from '@turf/helpers';
import { MapSelection, ViewState } from '../types';

type PopupContainerProps = {

  selected: MapSelection; 
  
  viewState: ViewState; 
  
  map: MapRef; 
  
  popup: Function;

  onClose: Function;

}

export const PopupContainer = (props: PopupContainerProps) => {

  const { selected, viewState, map, popup} = props;

  const [ offset, setOffset ] = useState<{ left: number, top: number }>();
  
  useEffect(() => {
    if (selected) {
      const lonlat = centroid(selected.feature as AllGeoJSON)?.geometry.coordinates as LngLatLike;
      const { x, y } = map.project(lonlat);
      setOffset({ left: x, top: y });
    }
  }, [selected, viewState]);

  return selected && (
    <div 
      className="p6o-map-popup-container"
      style={{ zIndex: 0, position: 'absolute', ...offset }}>

      {popup({...props, onClose: props.onClose })}

    </div>
  );

}