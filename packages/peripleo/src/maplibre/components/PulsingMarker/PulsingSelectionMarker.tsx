import { useEffect } from 'react';
import { StylePropertyExpression } from 'maplibre-gl';
import { useMap } from '../../map';
import { useSelectionValue } from '../../../state';
import { PulsingMarker } from './PulsingMarker';

const EMPTY_GEOJSON = { type: 'FeatureCollection', features: [] };

interface SelectionCircleProps {

  duration?: number;

  rgb?: [number, number, number];

  size: number;

}

export const PulsingSelectionMarker = (props: SelectionCircleProps) => {

  const rgb = props.rgb || [246, 112, 86];

  const duration = props.duration || 1000;

  const map = useMap();

  const selection = useSelectionValue();

  useEffect(() => {
    const onLoad = () => {
      map.addImage(
        'selection-pulse', 
        PulsingMarker(props.size * 2, rgb, duration, map), 
        { pixelRatio: 2 });

      map.addSource('pulsing-selection-marker-source', {
        type: 'geojson',
        data: EMPTY_GEOJSON
      });

      //@ts-ignore
      map.addLayer({
        id: 'pulsing-selection-marker',
        type: 'symbol',
        source: 'pulsing-selection-marker-source',
        layout: {
          'icon-image': [
            'match', 
            ['typeof', ['get', 'relation']],
            'string',
            ['match', ['get', 'relation'],
              'foundAt', 'pulse-foundAt',
              'producedAt', 'pulse-producedAt',
              'usedAt', 'pulse-usedAt',
              'pulse-default'
            ],
            'selection-pulse'
          ]
        }
      } as StylePropertyExpression);  
    }

    map.on('load', onLoad);

    return () => {
      map.off('load', onLoad);
    }
  }, []);

  useEffect(() => {
    if (selection) {
      // @ts-ignore
      map.getSource('pulsing-selection-marker-source')?.setData(selection);
    } else {
      // @ts-ignore
      map.getSource('pulsing-selection-marker-source')?.setData(EMPTY_GEOJSON);
    }
  }, [selection]);

  return null;

}