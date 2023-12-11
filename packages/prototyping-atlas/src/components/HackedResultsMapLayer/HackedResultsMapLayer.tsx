import { useEffect, useState } from 'react';
import { FeatureCollection } from '@peripleo/peripleo';
import { useMap } from '@peripleo/peripleo/maplibre';
import { useCachedHits } from '../TypeSenseSearch';

type HackedResultsMapLayerProps = { 

  id: string

}; 

const EMPTY_GEOJSON = {
  type: 'FeatureCollection',
  features: []
};

const toGeoJSON = (hits: any[]): FeatureCollection => ({
  type: 'FeatureCollection',
  features: hits.map(hit => {
    const { id, name, names, objectID, record_id, type, type_facet, geometry } = hit;

    return {
      id,
      type: 'Feature',
      properties: {
        id, name, names, objectID, record_id, type, type_facet
      },
      geometry
    }
  }) 
});

const searchResultLayerStyle = {
  'type': 'circle',
  'paint': {
    'circle-radius': [
      'interpolate', 
      ['linear'],
      ['number', ['get','point_count'], 1 ],
      0, 4, 
      10, 14
    ],
    'circle-stroke-width': 1,
    'circle-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      '#3b62ff',
      '#ff623b'
    ],
    'circle-stroke-color': '#8d260c'
  }
};

export const HackedResultsMapLayer = (props: HackedResultsMapLayerProps) => {

  const { id } = props;

  const hits = useCachedHits();

  const [sourceId, setSourceId] = useState<string | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);

  const map = useMap();

  useEffect(() => {
    const onLoad = () => setMapLoaded(true);
    map.on('load', onLoad);
  }, []);

  useEffect(() => {
    if (mapLoaded) {
      if (!sourceId) {
        const sourceId = `${props.id}-source`;

        map.addSource(sourceId, {
          type: 'geojson',
          data: toGeoJSON(hits),
          cluster: true,
          clusterRadius: 6
        });

        map.addLayer({
          ...searchResultLayerStyle,
          id: props.id,
          // @ts-ignore
          source: sourceId,
          metadata: {
            interactive: true,
          }
        });

        setSourceId(sourceId);
      } else {
        const geojson = toGeoJSON(hits);

        // @ts-ignore
        map.getSource(sourceId).setData(geojson);
      }
    }
  }, [id, hits, mapLoaded, sourceId, toGeoJSON]);

  return null;

}