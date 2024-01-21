import { useEffect } from 'react';
import { removeLayerIfExists, removeSourceIfExists, useMap } from '../../map';

interface RasterOverlayLayerProps {

  id: string;

  url: string;

  tilesize?: number

}

export const RasterOverlayLayer = (props: RasterOverlayLayerProps) => {

  const { id, url, tilesize } = props;

  const map = useMap();

  useEffect(() => {
    window.setTimeout(() => {
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
    }, 1);

    return () => {
      removeLayerIfExists(map, `layer-${id}`);
      removeSourceIfExists(map, `source-${id}`);
    }
  }, []);

  return null;
  
}