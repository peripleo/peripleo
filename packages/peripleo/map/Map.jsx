import React, { useRef } from 'react';
import ReactMapGL from 'react-map-gl';

import { useSearch } from '../search';

import PointLayer from './layer/PointLayer';

import './Map.css';

export const MapLibreGL = React.forwardRef((props, ref) => {

  const mapRef = useRef();
  
  const { search } = useSearch();

  const data = search?.status === 'OK' ? {
    type: 'FeatureCollection',
    features: search.result.items 
  } : [];

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