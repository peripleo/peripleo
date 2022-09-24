import React, { useRef } from 'react';
import ReactMapGL from 'react-map-gl';
import { useSearch } from '../search';

import './Map.css';
import 'maplibre-gl/dist/maplibre-gl.css';

export const MapLibreGL = React.forwardRef((props, ref) => {

  const mapRef = useRef();
  
  const { search } = useSearch();

  const data = search?.status === 'OK' && search.result.items.length > 0 ? {
    type: 'FeatureCollection',
    features: search.result.items 
  } : null  ;

  const initialViewState = props.defaultBounds ? {
    bounds: props.defaultBounds
  } : null;
  
  return (
    <div 
      ref={ref}
      className='p6o-map-container'>

      <ReactMapGL
        ref={mapRef}
        mapStyle={props.mapStyle}
        initialViewState={initialViewState}>

        {React.Children.map(props.children, c => React.cloneElement(c, { data }))}

      </ReactMapGL>
    </div>
  )

});