import React from 'react';
import { Source, Layer } from 'react-map-gl';
import chroma from 'chroma-js';

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

// https://gist.github.com/danieliser/b4b24c9f772066bcf0a6
const hexToRGBA = (hexCode: string, opacity = 1) => {  
  let hex = hexCode.replace('#', '');
  
  if (hex.length === 3)
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgba(${r},${g},${b},${opacity})`;
};

const colorScale = (color: string) => ([
  0,
  hexToRGBA(color, 0), 
  0.2,
  hexToRGBA(color, 0.1),
  0.4,
  hexToRGBA(color, 0.2),
  0.6,
  hexToRGBA(color, 0.4),
  0.8,
  hexToRGBA(color, 0.6),
  1,
  hexToRGBA(color, 0.7)
]);

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
    'circle-color': color,
    'circle-stroke-color': chroma(color).darken().hex(),
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

type HeatmapLayerProps = {

  data: any
  
  id: string

  color: string

}

export const HeatmapLayer = (props: HeatmapLayerProps) => {

  const heatmap = coverageStyle(DEFAULT_SCALE);

  const point = pointStyle(props.color);

  return (
    <Source type="geojson" data={props.data}>
      {/* @ts-ignore */}
      <Layer id={`${props.id}-ht`} {...heatmap} />
      {/* @ts-ignore */}
      <Layer id={`${props.id}-pt`} {...point} />
    </Source>
  )

}