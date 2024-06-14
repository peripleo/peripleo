import { ReactNode, useEffect, useState } from 'react';
import { Feature, FeatureCollection } from '@peripleo/peripleo';
import { removeLayerIfExists, removeSourceIfExists, useLoadedMap } from '../../map';
import { Tooltip } from '../Tooltip';
import { useSymbols } from './useSymbols';

interface SymbolLayerProps <T extends { [key: string]: any }>{

  data: FeatureCollection<T> | string;

  id: string;

  interactive?: boolean;

  size?: number;

  symbol?: string;

  symbolsMap?: {

    [id: string]: string;
  
  } 
  
  symbolsProperty?: string;

  tooltip?(target: Feature<T>, event: MouseEvent): ReactNode;

}

/**
 * For the general pattern, see: 
 * https://maplibre.org/maplibre-gl-js/docs/examples/add-image/
 */
export const SymbolLayer = <T extends { [key: string]: any }>(props: SymbolLayerProps<T>) => {

  const { data, id, symbolsProperty } = props;

  const [sourceId, setSourceId] = useState<string | undefined>();

  const map = useLoadedMap();

  const symbols = useSymbols(map, props.symbol || props.symbolsMap);

  useEffect(() => {
    if (!map || !symbols) return;

    const sourceId = `source-${id}`;

    map.addSource(sourceId, {
      type: 'geojson',
      // @ts-ignore
      data
    });

    const iconImage = Array.isArray(symbols)
      ? ['get', symbolsProperty || 'symbol']
      : symbols;

    map.addLayer({
      id: `layer-${id}`,
      type: 'symbol',
      source: sourceId,
      layout: {
        // @ts-ignore
        'icon-image': iconImage,
        'icon-size': props.size || 0.25,
        'icon-allow-overlap': true
      },
      metadata: {
        interactive: props.interactive
      }
    });

    setSourceId(sourceId);

    return () => {
      removeLayerIfExists(map, `layer-${id}`);
      removeSourceIfExists(map, `source-${id}`);
    }
  }, [map, symbols, symbolsProperty]);

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