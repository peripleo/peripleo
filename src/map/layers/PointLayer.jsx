import React from 'react';
import { Source, Layer } from 'react-map-gl';
import chroma from 'chroma-js';

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

export const PointLayer = props => {

  const style = pointStyle({
    fill: props.color,
    stroke: chroma(props.color).darken().hex(),
    ramp: props.sizes
  });

  return (
    <Source type="geojson" data={props.data}>
      <Layer {...style} />
    </Source>
  )

}