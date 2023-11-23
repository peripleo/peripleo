import { useEffect, useState } from 'react';
import { useMap } from '@peripleo/peripleo/maplibre';
import { UseGeoSearchProps, useGeoSearch } from 'react-instantsearch';
import { FeatureCollection } from '@peripleo/peripleo';

type SearchResultsMapLayerProps = UseGeoSearchProps & { 

  id: string,

  style: object,

  toGeoJSON(item: any): FeatureCollection

}; 

const EMPTY_GEOJSON = {
  type: 'FeatureCollection',
  features: []
};

export const SearchResultsMapLayer = (props: SearchResultsMapLayerProps) => {

  const { id, style, toGeoJSON, ...rest } = props;

  const { items, refine } = useGeoSearch(rest);

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
          // TODO
          data: EMPTY_GEOJSON
        });

        map.addLayer({
          ...props.style,
          id: props.id,
          // @ts-ignore
          source: sourceId,
          metadata: {
            interactive: true,
          }
        });

        setSourceId(sourceId);
      } else {
        // TODO 
        console.log(items);
        
        const geojson = toGeoJSON(items);

        // @ts-ignore
        map.getSource(sourceId).setData(geojson);
      }
    }
  }, [id, items, mapLoaded, refine, sourceId, style, toGeoJSON]);

  return null;

}