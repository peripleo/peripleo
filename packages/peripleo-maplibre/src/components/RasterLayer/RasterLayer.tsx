import { useEffect } from 'react';
import { removeLayerIfExists, removeSourceIfExists } from '../../map';
import { useLoadedMap } from 'src/hooks';

interface RasterLayerProps {

  id: string;

  url: string;

  tilesize?: number

}

export const RasterLayer = (props: RasterLayerProps) => {

  const { id, url, tilesize } = props;

  const map = useLoadedMap();

  useEffect(() => {
    if (!map) return;

    map.addSource(`source-${id}`, {
      type: 'raster',
      tiles: [ url ],
      tileSize: tilesize || 256
    });

    map.addLayer({
      id: `layer-${id}`,
      type: 'raster',
      source: `source-${id}`,
      paint: {
        'raster-opacity': 1
      }
    });

    return () => {
      removeLayerIfExists(map, `layer-${id}`);
      removeSourceIfExists(map, `source-${id}`);
    }
  }, [map, url]);

  return null;
  
}