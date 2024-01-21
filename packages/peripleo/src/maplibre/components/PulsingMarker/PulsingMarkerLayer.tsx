import { FeatureCollection } from '../../../model';
import { useMap } from '../../map';
import { useEffect } from 'react';
import { usePulsingMarker } from './usePulsingMarker';

interface PulsingMarkerLayerProps {

  id: string;

  size?: number;

  data: FeatureCollection

}

export const PulsingMarkerLayer = (props: PulsingMarkerLayerProps) => {

  const { id, data } = props;

  const map = useMap();

  const marker = usePulsingMarker(props.size || 100);

  useEffect(() => {
    map.addSource(`source-${id}-pulse`, {
      type: 'geojson',
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
  }, []);

  return null;

}