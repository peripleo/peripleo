import { useEffect } from 'react';
import { useLoadedMap } from './useMap';
import { getFeature } from 'src/map';
import { MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl';

export const useClickInteractiveFeature = (onClick: (feature: MapGeoJSONFeature) => void)=> {

  const map = useLoadedMap();

  useEffect(() => {
    if (!map) return;

    const onMapClicked = (evt: MapMouseEvent) => {
      const feature = getFeature(evt, true);
      onClick(feature);
    }

    map.on('click', onMapClicked);

    return () => {
      map.off('click', onMapClicked);
    }
  }, [map, onClick]);

}