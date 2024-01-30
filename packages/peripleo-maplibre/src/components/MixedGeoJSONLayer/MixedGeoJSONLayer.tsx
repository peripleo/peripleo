import { ReactNode, useEffect } from 'react';
import { useMap } from '../../map';
import { Feature, FeatureCluster, FeatureCollection } from '@peripleo/peripleo';
import { AddLayerObject } from 'maplibre-gl';
import { Tooltip } from '../Tooltip';

interface MixedGeoJSONLayerProps <T extends { [key: string]: any }>{

  id: string;

  data: FeatureCollection<T> | string;

  fillStyle: Object;

  strokeStyle: Object;

  pointStyle: Object;

  interactive?: boolean;

  tooltip?(target: Feature<T> | FeatureCluster<T>, event: MouseEvent): ReactNode;

}

export const MixedGeoJSONLayer = <T extends { [key: string]: any }>(props: MixedGeoJSONLayerProps<T>) => {

  const { id, data } = props;

  const map = useMap();

  useEffect(() => {
    map.addSource(`source-${id}`, {
      type: 'geojson',
      data
    });

    map.addLayer({
      id: `layer-${id}-fill`,
      ...props.fillStyle,
      source: `source-${id}`,
      filter: ['!=', '$type', 'Point'],
      metadata: {
        interactive: props.interactive
      }
    } as unknown as AddLayerObject);

    map.addLayer({
      id: `layer-${id}-line`,
      ...props.strokeStyle,
      source: `source-${id}`,
      filter: ['!=', '$type', 'Point'],
    } as unknown as AddLayerObject);

    map.addLayer({
      id: `layer-${id}-point`,
      ...props.pointStyle,
      filter: ['==', '$type', 'Point'],
      source: `source-${id}`,
      metadata: {
        interactive: props.interactive
      }
    } as unknown as AddLayerObject);

    setTimeout(() => map.moveLayer(`layer-${id}-point`), 10);

    return () => {
      map.removeLayer(`layer-${id}-point`);
      map.removeLayer(`layer-${id}-line`);
      map.removeLayer(`layer-${id}-fill`);

      map.removeSource(`source-${id}`);
    }
  }, [data]);

  return props.tooltip ? (
    <Tooltip
      layerId={[`layer-${id}-point`, `layer-${id}-fill`]} 
      content={props.tooltip} />
  ) : null;

}