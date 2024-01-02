import { useEffect, useState } from 'react';
import { FeatureCollection } from '@peripleo/peripleo';
import { toFeature, useCachedHits } from '../TypeSenseSearch';
import { useMap } from '@peripleo/peripleo/maplibre';

type SearchResultsMapLayerProps = { 

  id: string;

  visible: boolean;

}; 

const toGeoJSON = (hits: any[]): FeatureCollection => ({
  type: 'FeatureCollection',
  features: hits.map(hit => toFeature(hit)) 
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

export const SearchResultsMapLayer = (props: SearchResultsMapLayerProps) => {

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
      const layerIds = new Set(map.getStyle().layers.map(l => l.id));

      if (layerIds.has(props.id))
        map.setLayoutProperty(props.id, 'visibility', props.visible ? 'visible' : 'none');
    }
  }, [props.visible, mapLoaded]);

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
          layout: {
            visibility: props.visible ? 'visible' : 'none'
          },
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