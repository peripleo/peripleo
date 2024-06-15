import { FeatureCollection } from '../../../../peripleo/src/model';
import { useLoadedMap } from '../../hooks';
import { useEffect } from 'react';
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
      map.removeLayer(`layer-${id}-pulse`);
      map.removeSource(`source-${id}-pulse`);
    }
  }, [map, data]);

  return null;

}