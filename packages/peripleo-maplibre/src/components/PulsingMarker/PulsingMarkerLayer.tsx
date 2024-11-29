import { useEffect } from 'react';
import { FeatureCollection } from '@peripleo/peripleo';
import { useLoadedMap } from '../../hooks';
import { removeLayerIfExists, removeSourceIfExists } from '../../map';
import { usePulsingMarker } from './usePulsingMarker';

interface PulsingMarkerLayerProps {

  id: string;

  size?: number;

  data: FeatureCollection

}

export const PulsingMarkerLayer = (props: PulsingMarkerLayerProps) => {

  const { id, data } = props;

  const map = useLoadedMap();

  const marker = usePulsingMarker(props.size || 100);

  useEffect(() => {
    if (!map) return;
    
    map.addSource(`source-${id}-pulse`, {
      type: 'geojson',
      // @ts-ignore
      data
    });

    // @ts-ignore
    map.addLayer({
      id: `layer-${id}-pulse`,
      ...marker,
      filter: ['==', '$type', 'Point'],
      source: `source-${id}-pulse`
    });

    return () => {
      removeLayerIfExists(map, `layer-${id}-pulse`);
      removeSourceIfExists(map, `source-${id}-pulse`);
    }
  }, [map, data]);

  return null;

}