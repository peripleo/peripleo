import { useContext, useEffect, useState } from 'react';
import { Map } from 'maplibre-gl';
import { MapContext } from '@peripleo/peripleo';

export const useMap = () => {
  const { map } = useContext(MapContext);
  return map as Map;
}

export const useLoadedMap = () => {

  const ctx = useContext(MapContext);

  const map = ctx.map as Map;

  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (map.loaded() || !map.style) {
      setMapLoaded(true);
    } else {
      const onLoad = () => setMapLoaded(true);
      map.on('load', onLoad); 
    }

    return () => {
      setMapLoaded(false);
    }
  }, [map]);

  return mapLoaded ? map : undefined;

}