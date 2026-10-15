import { useEffect } from 'react';
import { removeLayerIfExists, removeSourceIfExists } from '../../map';
import { useLoadedMap } from 'src/hooks';

interface RasterLayerProps {

  id: string;

  url: string;

  tilesize?: number;

  attribution?: string;

  beforeId?: string;

}

export const RasterLayer = (props: RasterLayerProps) => {

  const { id, url, tilesize, beforeId, attribution } = props;

  const map = useLoadedMap();

  useEffect(() => {
    if (!map) return;

    map.addSource(`source-${id}`, {
      type: 'raster',
      tiles: [ url ],
      tileSize: tilesize || 256,
      ...(attribution ? { attribution: attribution } : {})
    });

    map.addLayer({
      id: `layer-${id}`,
      type: 'raster',
      source: `source-${id}`,
      paint: {
        'raster-opacity': 1
      }
    }, beforeId);

    return () => {
      removeLayerIfExists(map, `layer-${id}`);
      removeSourceIfExists(map, `source-${id}`);
    }
  }, [map, url]);

  return null;
  
}