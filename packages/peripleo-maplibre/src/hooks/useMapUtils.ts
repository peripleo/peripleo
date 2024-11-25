import { useCallback, useEffect, useRef } from 'react';
import { findMapFeature as _findMapFeature } from '../map';
import { useLoadedMap } from './useMap';
import { Map } from 'maplibre-gl';

export const useMapUtils = () => {

  const map = useLoadedMap();

  const mapRef = useRef<Map>(map);

  useEffect(() => {
    mapRef.current = map;
  }, [map]);

  // Utils should act like a ref - don't change the util when the map changes!
  const findMapFeature = useCallback((id: number) => {
    return mapRef.current ? _findMapFeature(mapRef.current, id) : Promise.resolve(undefined);
  }, []);

  return { findMapFeature };

}