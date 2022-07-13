import React from 'react';
import { Source, Layer } from 'react-map-gl';
import chroma from 'chroma-js';

// TODO just for testing
const FILL = '#9d00d1';
const STROKE =  chroma(FILL).darken().hex();

const pointStyle = ({ fill, stroke, strokeWidth, ramp }) => ({
  'type': 'circle',
  'paint': {
    'circle-radius': [
      'interpolate', 
      ['linear'],
      ['number', ['get','weight'], 0 ],
      ...ramp
    ],
    'circle-color': fill || '#fff',
    'circle-stroke-color': stroke || '#000',
    'circle-stroke-width': strokeWidth || 1
  }
});

const PointLayer = props => {

  const style = pointStyle({
    fill: FILL,
    stroke: STROKE,
    ramp: [
      0, 5,
      30, 24
    ]
  });

  return (
    <Source type="geojson" data={props.data}>
      <Layer {...style} />
    </Source>
  )

}

export default PointLayer;