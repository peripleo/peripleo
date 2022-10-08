import React from 'react';
import { Source, Layer } from 'react-map-gl';
import chroma from 'chroma-js';
import { Geometry, GeoJsonProperties, FeatureCollection } from 'geojson';

const pointStyle = ({ fill = '#fff', stroke = '#000', strokeWidth = 1, ramp = [0, 4, 18, 18] }) => ({
  'type': 'circle',
  'paint': {
    'circle-radius': [
      'interpolate', 
      ['linear'],
      ['number', ['get','count'], 0 ],
      ...ramp
    ],
    'circle-color': fill,
    'circle-stroke-color': stroke ,
    'circle-stroke-width': strokeWidth
  }
});

type PointLayerProps = {

  id: string,

  color: string 
  
  sizes: number[]
  
  data: FeatureCollection<Geometry, GeoJsonProperties> | undefined

}

export const PointLayer = (props: PointLayerProps) => {

  const style = pointStyle({
    fill: props.color,
    stroke: chroma(props.color).darken().hex(),
    ramp: props.sizes
  });

  return (
    <Source type="geojson" data={props.data}>
      {/* @ts-ignore */}
      <Layer id={props.id} {...style} />
    </Source>
  )

}