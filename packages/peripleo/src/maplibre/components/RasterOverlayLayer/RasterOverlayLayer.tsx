import { useEffect } from 'react';
import { useMap } from '../../map';

interface RasterOverlayLayerProps {

  id: string;

  url: string;

  tilesize?: number

}

export const RasterOverlayLayer = (props: RasterOverlayLayerProps) => {

  const { id, url, tilesize } = props;

  const map = useMap();

  useEffect(() => {
    map.addSource(`source-${id}`, {
      type: 'raster',
      tiles: [ url ],
      tileSize: tilesize || 256
    });

    map.addLayer({
      id: `layer-${id}`,
      type: 'raster',
      source: `source-${id}`,
      paint: {}
    });

    return () => {
      map.removeLayer(`layer-${id}`);
      map.removeSource(`source-${id}`);
    }
  }, []);

  return null;
  
}