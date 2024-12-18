import { ReactNode, useEffect, useState } from 'react';
import { Feature, FeatureCollection } from '@peripleo/peripleo';
import { AddLayerObject, Map } from 'maplibre-gl';
import { HoverState, useLoadedMap } from '../../hooks';
import { removeLayerIfExists, removeSourceIfExists } from '../../map';
import { HoverTooltip } from '../HoverTooltip';
import { 
  DEFAULT_FILL_STYLE, 
  DEFAULT_POINT_STYLE, 
  DEFAULT_STROKE_STYLE 
} from './defaultStyles';

interface GeoJSONLayerProps <T extends { [key: string]: any }> {

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

  tooltip?(hoverState: HoverState<Feature<T>>): ReactNode;

  strokeStyle?: Object;

  visible?: boolean;

  onLoad?(): void;

}

const setStyle = (map: Map | undefined, layerId: string, style: any) => {
  if (!map) return;
    
  Object
    .entries(style.paint)
    .forEach(([key, value]) => 
      map.setPaintProperty(layerId, key, value));
}

export const GeoJSONLayer = <T extends { [key: string]: any }>(props: GeoJSONLayerProps<T>) => {

  const { id, data } = props;

  const visible = props.visible === undefined ? true : props.visible;

  const fillStyle = props.fillStyle || DEFAULT_FILL_STYLE;

  const strokeStyle = props.strokeStyle || DEFAULT_STROKE_STYLE;

  const pointStyle = props.pointStyle || DEFAULT_POINT_STYLE;

  const map = useLoadedMap();

  const [sourceId, setSourceId] = useState<string | undefined>();

  useEffect(() => {
    if (map) {
      const layerIds = new Set(map.getStyle().layers.map(l => l.id));

      if (layerIds.has(props.id))
        map.setLayoutProperty(props.id, 'visibility', visible ? 'visible' : 'none');
    }
  }, [visible, map]);

  useEffect(() => {
    if (!map) return;

    const sourceId = `source-${id}`;

    map.addSource(sourceId, {
      type: 'geojson',
      // @ts-ignore
      data,
      // Note that mapLibre checks by key, and will fail if cluster args 
      // are undefined. Therefore we need to add on demand.
      ...(props.cluster && { cluster: true }),
      ...(props.clusterRadius !== undefined && { clusterRadius: props.clusterRadius }),
      ...(props.clusterMaxZoom !== undefined && { clusterMaxZoom: props.clusterMaxZoom }),
      ...(props.clusterMinPoints !== undefined && { clusterMinPoints: props.clusterMinPoints }),
      ...(props.clusterProperties !== undefined && { clusterProperties: props.clusterProperties }),
    });

    // Map emits 'IDLE' event when the source is fully loaded
    if (props.onLoad)
      map.once('idle', () => props.onLoad());

    if (!props.cluster) {
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
    }

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
  }, [map]);

  useEffect(() => {
    if (!sourceId) return;

    // @ts-ignore
    map.getSource(sourceId).setData(data);
  }, [sourceId, data]);

  useEffect(() => {
    if (!props.cluster)
      setStyle(map, `layer-${id}-fill`, props.fillStyle|| DEFAULT_FILL_STYLE)
  }, [props.fillStyle, props.cluster]);

  useEffect(() => {
    if (!props.cluster)
      setStyle(map, `layer-${id}-line`, props.strokeStyle|| DEFAULT_STROKE_STYLE)
  }, [props.strokeStyle, props.cluster]);

  useEffect(() => {
    setStyle(map, `layer-${id}-point`, props.pointStyle|| DEFAULT_POINT_STYLE)
  }, [props.pointStyle]);
  
  return props.tooltip ? (
    <HoverTooltip
      layerId={[`layer-${id}-point`, `layer-${id}-fill`]} 
      tooltip={props.tooltip} />
  ) : null;

}