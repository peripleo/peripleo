import React, { useRef } from 'react';
import ReactMapGL from 'react-map-gl';

import { useStore } from '../store';

import './Map.css';

export const MapLibreGL = React.forwardRef((props, ref) => {

  const mapRef = useRef();
  
  const store = useStore();

  return (
    <div 
      ref={ref}
      className='p6o-map-container'>

      <ReactMapGL
        ref={mapRef}
        mapStyle={props.mapStyle}>

      </ReactMapGL>
    </div>
  )

});