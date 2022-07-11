import React, { useRef } from 'react';
import ReactMapGL from 'react-map-gl';

import './Map.css';

export const Map = React.forwardRef((props, ref) => {

  const mapRef = useRef();
  
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