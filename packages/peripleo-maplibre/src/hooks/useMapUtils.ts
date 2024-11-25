import { useCallback } from 'react';
import { findMapFeature as _findMapFeature } from '../map';
import { useLoadedMap } from './useMap';

export const useMapUtils = () => {

  const map = useLoadedMap();

  const findMapFeature = useCallback((id: number) => {
    return map ? _findMapFeature(map, id) : Promise.resolve(undefined);
  }, [map]);

  return { findMapFeature };

}