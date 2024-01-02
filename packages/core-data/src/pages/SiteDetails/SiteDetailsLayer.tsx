import { useEffect } from 'react';
import { useMap, usePulsingMarker } from '@peripleo/peripleo/maplibre';
import bbox from '@turf/bbox';
import { CoreDataPlaceFeature, toFeature } from '../../model';
import { POINT_STYLE, FILL_STYLE, STROKE_STYLE } from '../../layerStyles';

interface SiteDetailsLayerProps {

  place: CoreDataPlaceFeature;

}

export const SiteDetailsLayer = (props: SiteDetailsLayerProps) => {

  const { place } = props;

  const map = useMap();

  const marker = usePulsingMarker(100);

  useEffect(() => {
    // @ts-ignore
    const recordId: string = place.record_id;

    const geom = {
      type: 'FeatureCollection',
      features: [toFeature(place, recordId)]
    };

    map.addSource(`source-${recordId}`, {
      type: 'geojson',
      data: geom
    });

    // @ts-ignore
    map.addLayer({
      id: `layer-${recordId}-fill`,
      ...FILL_STYLE,
      source: `source-${recordId}`,
      filter: ['!=', '$type', 'Point']
    });

    // @ts-ignore
    map.addLayer({
      id: `layer-${recordId}-line`,
      ...STROKE_STYLE,
      source: `source-${recordId}`,
      filter: ['!=', '$type', 'Point']
    });

    // @ts-ignore
    map.addLayer({
      id: `layer-${recordId}-halo`,
      ...marker,
      filter: ['==', '$type', 'Point'],
      source: `source-${recordId}`
    });

    // @ts-ignore
    map.addLayer({
      id: `layer-${recordId}-point`,
      ...POINT_STYLE,
      filter: ['==', '$type', 'Point'],
      source: `source-${recordId}`
    });


    // Zoom to bounds
    const [minX, minY, maxX, maxY] = bbox(geom);
    
    map.fitBounds([[minX, minY], [maxX, maxY]], { 
      padding: 100,
      maxZoom: 14
    });

    return () => {
      map.removeLayer(`layer-${recordId}-line`);
      map.removeLayer(`layer-${recordId}-fill`);
      map.removeLayer(`layer-${recordId}-halo`);
      map.removeLayer(`layer-${recordId}-point`);

      map.removeSource(`source-${recordId}`);
    }
  }, []);

  return null;

}