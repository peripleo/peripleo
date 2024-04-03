import { ReactNode, useEffect, useState } from 'react';
import { Feature, FeatureCluster, FeatureCollection } from '@peripleo/peripleo';
import { removeLayerIfExists, removeSourceIfExists, useLoadedMap } from '../../map';
import { Tooltip } from '../Tooltip';

interface SymbolLayerProps <T extends { [key: string]: any }>{

  data: FeatureCollection<T> | string;

  id: string;

  interactive?: boolean;

  size: number;

  symbol: string;

  tooltip?(target: Feature<T> | FeatureCluster<T>, event: MouseEvent): ReactNode;

}

/**
 * For the general pattern, see: 
 * https://maplibre.org/maplibre-gl-js/docs/examples/add-image/
 */
export const SymbolLayer = <T extends { [key: string]: any }>(props: SymbolLayerProps<T>) => {

  const { data, id, symbol } = props;

  const [sourceId, setSourceId] = useState<string | undefined>();

  const map = useLoadedMap();

  useEffect(() => {
    if (!map) return;

    const sourceId = `source-${id}`;

    map.loadImage(symbol).then(image => {
      map.addImage(`image-${id}`, image.data);

      map.addSource(sourceId, {
        type: 'geojson',
        // @ts-ignore
        data
      });

      map.addLayer({
        id: `layer-${id}`,
        type: 'symbol',
        source: sourceId,
        layout: {
          'icon-image': `image-${id}`,
          'icon-size': props.size,
          'icon-allow-overlap': true
        },
        metadata: {
          interactive: props.interactive
        }
      });
    });

    return () => {
      if (map.getImage(`image-${id}`))
        map.removeImage(`image-${id}`);

      removeLayerIfExists(map, `layer-${id}`);
      removeSourceIfExists(map, `source-${id}`);
    }
  }, [map, symbol]);

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