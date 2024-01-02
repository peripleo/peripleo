import { useEffect } from 'react';
import { useMap } from '@peripleo/peripleo/maplibre';
import bbox from '@turf/bbox';
import { CoreDataPlaceFeature, toFeature } from '../../model';

interface SiteDetailsLayerProps {

  place: CoreDataPlaceFeature;

}

const FILL_STYLE = {
  'type': 'fill',
  'paint': {
    'fill-color': '#ff623b',
    'fill-opacity': 0.2
  }
}

const STROKE_STYLE = {
  'type': 'line',
  'paint': {
    'line-color': '#ff623b',
    'line-opacity': 0.6
  }
}

export const SiteDetailsLayer = (props: SiteDetailsLayerProps) => {

  const { place } = props;

  const map = useMap();

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

    map.addLayer({
      id: `layer-${recordId}-fill`,
      ...FILL_STYLE,
      // @ts-ignore
      source: `source-${recordId}`
    });

    map.addLayer({
      id: `layer-${recordId}-line`,
      ...STROKE_STYLE,
      // @ts-ignore
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

      map.removeSource(`source-${recordId}`);
    }
  }, []);

  return null;

}