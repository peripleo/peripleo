import { ReactNode, useEffect } from 'react';
import { useMap } from '../../map';
import { Feature, FeatureCluster, FeatureCollection } from '@/model';
import { AddLayerObject } from 'maplibre-gl';
import { Tooltip } from '../Tooltip';

interface MixedGeoJSONLayerProps {

  id: string;

  data: FeatureCollection | string;

  fillStyle: Object;

  strokeStyle: Object;

  pointStyle: Object;

  tooltip?(target: Feature | FeatureCluster, event: MouseEvent): ReactNode;

}

export const MixedGeoJSONLayer = (props: MixedGeoJSONLayerProps) => {

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
      filter: ['!=', '$type', 'Point']
    } as unknown as AddLayerObject);

    map.addLayer({
      id: `layer-${id}-line`,
      ...props.strokeStyle,
      source: `source-${id}`,
      filter: ['!=', '$type', 'Point']
    } as unknown as AddLayerObject);

    map.addLayer({
      id: `layer-${id}-point`,
      ...props.pointStyle,
      filter: ['==', '$type', 'Point'],
      source: `source-${id}`
    } as unknown as AddLayerObject);

    setTimeout(() => map.moveLayer(`layer-${id}-point`), 10);

    return () => {
      map.removeLayer(`layer-${id}-point`);
      map.removeLayer(`layer-${id}-line`);
      map.removeLayer(`layer-${id}-fill`);

      map.removeSource(`source-${id}`);
    }
  }, []);

  return props.tooltip ? (
    <Tooltip 
      layerId={[`layer-${id}-point`, `layer-${id}-fill`]} 
      content={props.tooltip} />
  ) : null;

}