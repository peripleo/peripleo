import { useContext } from 'react';
import { Map } from 'maplibre-gl';
import { MapContext } from '@peripleo/peripleo';

export const useMap = () => {
  const { map } = useContext(MapContext);
  return map as Map;
}