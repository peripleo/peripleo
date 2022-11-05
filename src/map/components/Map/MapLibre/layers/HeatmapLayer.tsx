import React from 'react';
import { Source, Layer } from 'react-map-gl';
import chroma from 'chroma-js';
import { useDeviceState } from '../../../../../device';

const DEFAULT_SCALE = [
  0,
  'rgba(49, 54, 149, 0)', 
  0.1,
  '#313695',
  0.2,
  '#4575b4',
  0.3,
  '#74add1',
  0.4,
  '#abd9e9',
  0.5,
  '#e0f3f8',
  0.6,
  '#fee090',
  0.7,
  '#fdae61',
  0.8,
  '#f46d43',
  0.9,
  '#d73027',
  1,
  '#a50026'
];

const coverageStyle = (scale: Array<number | string>) => ({
  'type': 'heatmap',
  'paint': {
    'heatmap-weight': 1,
    'heatmap-intensity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0,
      0.2,
      9,
      2.5
    ],
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      ...scale
    ],
    'heatmap-radius': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0,
      1,
      12,
      28
    ],
    'heatmap-opacity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      8,
      1,
      10,
      0
    ]
  }
});

const pointStyle = (color: string) => ({
  'type': 'circle',
  'paint': {
    'circle-radius': [
      'interpolate', 
      ['linear'],
      ['number', ['get','count'], 0 ],
      0, 5,
      4000, 20
    ],
    'circle-color': [
      'case', 
      ['==', ['get', 'is_centroid'], true], 
      '#808080', 
      color
    ],
    'circle-stroke-color': [
      'case', 
      ['==', ['get', 'is_centroid'], true], 
      chroma('#808080').darken().hex(), 
      chroma(color).darken().hex()
    ], 
    'circle-stroke-width': 1,
    'circle-opacity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      7,
      0,
      10,
      ['case', ['==', ['get', 'is_centroid'], true], 0.5, 1]
    ],
    'circle-stroke-opacity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      7,
      0,
      10,
      ['case', ['==', ['get', 'is_centroid'], true], 0.5, 1]
    ]
  }
});

const clickbufferStyle = (radius: number) => ({
  'type': 'circle',
  'paint': {
    'circle-radius': radius,
    'circle-color': 'transparent',
    'circle-stroke-width': 0,
    'circle-opacity': 0.5,
    'circle-stroke-opacity': 0
  }
});


type HeatmapLayerProps = {

  data: any
  
  id: string

  color: string

}

export const HeatmapLayer = (props: HeatmapLayerProps) => {

  const device = useDeviceState();

  const heatmap = coverageStyle(DEFAULT_SCALE);

  const point = pointStyle(props.color);

  const clickbuffer = device.isTouchDevice ? clickbufferStyle(15) : null;

  return (
    <Source type="geojson" data={props.data}>
      {/* @ts-ignore */}
      {clickbuffer && <Layer id={`${props.id}-clickbuffer`} {...clickbuffer} /> }

      {/* @ts-ignore */}
      <Layer id={`${props.id}-ht`} {...heatmap} />

      {/* @ts-ignore */}
      <Layer id={`${props.id}-pt`} {...point} />
    </Source>
  )

}