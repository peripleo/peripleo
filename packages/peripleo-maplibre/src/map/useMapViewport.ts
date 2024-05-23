import { useEffect, useState } from 'react';
import type { LngLatBounds } from 'maplibre-gl';
import { useLoadedMap } from './useMap';

export const useMapViewport = () => {

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

    map.on('dragend', onChangeViewport);
    map.on('zoomend', onChangeViewport);
  
    return () => {
      map.off('dragend', onChangeViewport);
      map.off('zoomend', onChangeViewport);
    }
  }, [map]);

  return bounds;

}