import React, { useRef } from 'react';
import ReactMapGL from 'react-map-gl';

import { useStore } from '../store';

import PointLayer from './layer/PointLayer';

import './Map.css';

export const MapLibreGL = React.forwardRef((props, ref) => {

  const mapRef = useRef();
  
  const store = useStore();

  const data = {
    type: 'FeatureCollection',
    features: store.getAllLocatedNodes()
  }

  return (
    <div 
      ref={ref}
      className='p6o-map-container'>

      <ReactMapGL
        ref={mapRef}
        mapStyle={props.mapStyle}>

        <PointLayer data={data} />

      </ReactMapGL>
    </div>
  )

});