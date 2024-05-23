import { useEffect, useState } from 'react';
import type { LngLatBounds } from 'maplibre-gl';
import { useLoadedMap } from './useMap';

export const useMapViewport = (current?: boolean) => {

  const map = useLoadedMap();

  const [bounds, setBounds] = useState<LngLatBounds | undefined>();

  useEffect(() => {
    if (!map) return;

    // Initial bounds
    setBounds(map.getBounds());

    const onChangeViewport = () => {
      const bounds = map.getBounds();
      setBounds(bounds);
    }

    if (current) {
      map.on('move', onChangeViewport);
      map.on('zoom', onChangeViewport);
    } else {
      map.on('dragend', onChangeViewport);
      map.on('zoomend', onChangeViewport);
    }
  
    return () => {
      if (current) {
        map.off('move', onChangeViewport);
        map.off('zoom', onChangeViewport);
      } else {
        map.off('dragend', onChangeViewport);
        map.off('zoomend', onChangeViewport);
      }
    }
  }, [map, current]);

  return bounds;

}