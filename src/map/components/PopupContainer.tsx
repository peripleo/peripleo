import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapRef, LngLatLike } from 'react-map-gl';
import centroid from '@turf/centroid';
import { AllGeoJSON } from '@turf/helpers';
import { IoCloseOutline } from 'react-icons/io5';
import { MapSelection, ViewState } from '../types';
import { Size, useDeviceState } from '../../device';

import './PopupContainer.css';
import { useAutoPosition } from './useAutoPosition';

type PopupContainerProps = {

  selected: MapSelection; 
  
  viewState: ViewState; 
  
  map: MapRef; 
  
  popup: Function;

  onClose: Function;

}

export const PopupContainer = (props: PopupContainerProps) => {

  const device = useDeviceState();
  
  const el = useRef<HTMLDivElement>(null);

  const { selected, viewState, map, popup} = props;

  const [ offset, setOffset ] = useState<{ left: number, top: number }>({ left: 0, top: 0 });

  const { top, left } = useAutoPosition(el, offset.left, offset.top);

  useEffect(() => {
    if (selected && device.size === Size.DESKTOP) {
      const lonlat = centroid(selected.feature as AllGeoJSON)?.geometry.coordinates as LngLatLike;
      const { x, y } = map.project(lonlat);
      setOffset({ left: x, top: y });
    } else if (selected) {
      setOffset({ left: 0, top: 0 });
    }
  }, [ selected, viewState, device.size ]);

  const renderedPopup = useMemo(() => 
    selected ? popup({ ...props, onClose: props.onClose }) : null, [ selected ]);

  return renderedPopup && offset.left > 0 && offset.top > 0 && (
    <div 
      className={device.size === Size.DESKTOP ? "p6o-map-popup-container" : "p6o-map-popup-container-mobile"}
      style={{ zIndex: 9, position: 'absolute', top, left }}>

      <button
        className="p6o-map-popup-close"
        /* @ts-ignore */
        onClick={props.onClose}>
        <IoCloseOutline />
      </button>

      <main ref={el}>
        {renderedPopup}
      </main>
    </div>
  );

}