import React, { useEffect, useState } from 'react';
import { MapRef, LngLatLike } from 'react-map-gl';
import centroid from '@turf/centroid';
import { AllGeoJSON } from '@turf/helpers';
import { MapSelection, ViewState } from './MapTypes';

type PopupContainerProps = {

  selected: MapSelection; 
  
  viewState: ViewState; 
  
  map: MapRef; 
  
  popup: Function;

}

const PopupContainer = (props: PopupContainerProps) => {

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
      style={{ position: 'absolute', ...offset }}>

      {popup(props)}

    </div>
  );

}

export default PopupContainer;