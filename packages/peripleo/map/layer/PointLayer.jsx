import React from 'react';
import { Source, Layer } from 'react-map-gl';

const PointLayer = props => {

  return (
    <Source type="geojson" data={props.data}>
      <Layer type="circle" />
    </Source>
  )

}

export default PointLayer;