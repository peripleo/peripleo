import { useContext } from 'react';
import { Map } from 'maplibre-gl';
import { MapContext } from '../../state';

export const useMap = () => {
  const { map } = useContext(MapContext);
  return map as Map;
}