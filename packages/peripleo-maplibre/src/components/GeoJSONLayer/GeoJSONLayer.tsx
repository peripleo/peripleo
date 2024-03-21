import { ReactNode, useEffect, useState } from 'react';
import { Feature, FeatureCluster, FeatureCollection } from '@peripleo/peripleo';
import { AddLayerObject, SourceSpecification } from 'maplibre-gl';
import { removeLayerIfExists, removeSourceIfExists, useMap } from '../../map';
import { Tooltip } from '../Tooltip';
import { 
  DEFAULT_FILL_STYLE, 
  DEFAULT_POINT_STYLE, 
  DEFAULT_STROKE_STYLE 
} from './defaultStyles';

interface GeoJSONLayerProps <T extends { [key: string]: any }>{

  cluster?: boolean;

  clusterMaxZoom?: number;

  clusterMinPoints?: number;
  
  clusterProperties?: unknown;

  clusterRadius?: number;

  data: FeatureCollection<T> | string;

  fillStyle?: Object;

  id: string;

  interactive?: boolean;

  pointStyle?: Object;

  tooltip?(target: Feature<T> | FeatureCluster<T>, event: MouseEvent): ReactNode;

  strokeStyle?: Object;

  visible?: boolean;

}

export const GeoJSONLayer = <T extends { [key: string]: any }>(props: GeoJSONLayerProps<T>) => {

  const { id, data } = props;

  const visible = props.visible === undefined ? true : props.visible;

  const fillStyle = props.fillStyle || DEFAULT_FILL_STYLE;

  const strokeStyle = props.strokeStyle || DEFAULT_STROKE_STYLE;

  const pointStyle = props.pointStyle || DEFAULT_POINT_STYLE;

  const map = useMap();

  const [mapLoaded, setMapLoaded] = useState(false);

  const [sourceId, setSourceId] = useState<string | undefined>();

  useEffect(() => {
    if (map.loaded()) {
      setMapLoaded(true);
    } else {
      const onLoad = () => setMapLoaded(true);
      map.on('load', onLoad); 
    }

    return () => {
      setMapLoaded(false);
    }
  }, [map]);

  useEffect(() => {
    if (mapLoaded) {
      const layerIds = new Set(map.getStyle().layers.map(l => l.id));

      if (layerIds.has(props.id))
        map.setLayoutProperty(props.id, 'visibility', visible ? 'visible' : 'none');
    }
  }, [visible, mapLoaded]);

  useEffect(() => {
    if (!mapLoaded) return;

    const sourceId = `source-${id}`;

    map.addSource(sourceId, {
      type: 'geojson',
      data,
      // Note that mapLibre checks by key, and will fail if cluster args 
      // are undefined. Therefore we need to add on demand.
      ...(props.cluster && { cluster: true }),
      ...(props.clusterRadius !== undefined && { clusterRadius: props.clusterRadius }),
      ...(props.clusterMaxZoom !== undefined && { clusterMaxZoom: props.clusterMaxZoom }),
      ...(props.clusterMinPoints !== undefined && { clusterMinPoints: props.clusterMinPoints }),
      ...(props.clusterProperties !== undefined && { clusterProperties: props.clusterProperties }),
    });

    map.addLayer({
      id: `layer-${id}-fill`,
      ...fillStyle,
      source: `source-${id}`,
      filter: ['!=', '$type', 'Point'],
      metadata: {
        interactive: props.interactive
      }
    } as unknown as AddLayerObject);

    map.addLayer({
      id: `layer-${id}-line`,
      ...strokeStyle,
      source: `source-${id}`,
      filter: ['!=', '$type', 'Point'],
    } as unknown as AddLayerObject);

    map.addLayer({
      id: `layer-${id}-point`,
      ...pointStyle,
      filter: ['==', '$type', 'Point'],
      source: `source-${id}`,
      metadata: {
        interactive: props.interactive
      }
    } as unknown as AddLayerObject);

    setSourceId(sourceId);

    setTimeout(() => map.moveLayer(`layer-${id}-point`), 10);

    return () => {
      removeLayerIfExists(map, `layer-${id}-point`);
      removeLayerIfExists(map, `layer-${id}-line`);
      removeLayerIfExists(map, `layer-${id}-fill`);

      removeSourceIfExists(map, sourceId);
    }
  }, [mapLoaded]);

  useEffect(() => {
    if (!sourceId) return;

    // @ts-ignore
    map.getSource(sourceId).setData(data);
  }, [sourceId, data]);

  return props.tooltip ? (
    <Tooltip
      layerId={[`layer-${id}-point`, `layer-${id}-fill`]} 
      content={props.tooltip} />
  ) : null;

}