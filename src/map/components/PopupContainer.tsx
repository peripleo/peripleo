import React, { useEffect, useState } from 'react';
import { MapRef, LngLatLike } from 'react-map-gl';
import centroid from '@turf/centroid';
import { AllGeoJSON } from '@turf/helpers';
import { IoCloseOutline } from 'react-icons/io5';
import { MapSelection, ViewState } from '../types';
import { Size, useDeviceState } from '../../device';

import './PopupContainer.css';

type PopupContainerProps = {

  selected: MapSelection; 
  
  viewState: ViewState; 
  
  map: MapRef; 
  
  popup: Function;

  onClose: Function;

}

export const PopupContainer = (props: PopupContainerProps) => {

  const device = useDeviceState();

  const { selected, viewState, map, popup} = props;

  const [ offset, setOffset ] = useState<{ left: number, top: number }>({ left: 0, top: 0 });
  
  useEffect(() => {
    if (selected && device.size === Size.DESKTOP) {
      const lonlat = centroid(selected.feature as AllGeoJSON)?.geometry.coordinates as LngLatLike;
      const { x, y } = map.project(lonlat);
      setOffset({ left: x, top: y });
    } else if (selected) {
      setOffset({ left: 0, top: 0 });
    }
  }, [selected, viewState, device.size]);

  return selected && (
    <div 
      className={device.size === Size.DESKTOP ? "p6o-map-popup-container" : "p6o-map-popup-container-mobile"}
      style={{ zIndex: 9, position: 'absolute', ...offset }}>

      <button
        className="p6o-map-popup-close"
        /* @ts-ignore */
        onClick={props.onClose}>
        <IoCloseOutline />
      </button>

      <main>
        {popup({...props, onClose: props.onClose })}
      </main>
    </div>
  );

}