import { Geometry, Feature, GeoJsonProperties, FeatureCollection } from 'geojson';
import React from 'react';
import { Source, Layer } from 'react-map-gl';

const coverageStyle = (ramp: Array<number | string>) => ({
  'type': 'heatmap',
  'maxzoom': 9,
  'paint': {
    'heatmap-weight': [
      'interpolate',
      ['linear'],
      ['get', 'count'],
      1,
      1,
      200,
      3
    ],
    'heatmap-intensity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0,
      1,
      9,
      5
    ],
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      ...ramp
    ],
    'heatmap-radius': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0,
      3,
      9,
      20
    ],
    'heatmap-opacity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      7,
      1,
      9,
      0
    ]
  }
});

const pointStyle = () => ({
  'type': 'circle',
  'minzoom': 6,
  'paint': {
    'circle-radius': [
      'interpolate', 
      ['linear'],
      ['number', ['get','colocated_records'], 0 ],
      0, 5,
      30, 24
    ],
    'circle-color': 'red',
    'circle-stroke-color': 'white',
    'circle-stroke-width': 1,
    'circle-opacity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      7,
      0,
      8,
      1
    ],
    'circle-stroke-opacity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      7,
      0,
      8,
      1
    ]
  }
});

type HeatmapLayerProps = {

  data: FeatureCollection | undefined; 
  
  id: string;

}

export const HeatmapLayer = (props: HeatmapLayerProps) => {

  const heatmap = coverageStyle([
    0,   'rgba(0, 0, 255, 0)',
    0.1, '#ffffb2',
    0.3, '#feb24c',
    0.5, '#fd8d3c',
    0.7, '#fc4e2a',
    1,   '#e31a1c'
  ]);

  const point = pointStyle();

  return (
    <Source type="geojson" data={props.data}>
      {/* @ts-ignore */}
      <Layer id={`${props.id}-ht`} {...heatmap} />
      {/* @ts-ignore */}
      <Layer id={`${props.id}-pt`} {...point} />
    </Source>
  )

}