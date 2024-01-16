import { MixedGeoJSONLayer, RasterOverlayLayer } from '@peripleo/peripleo/maplibre';
import { MapLayerConfig } from '../../CoreDataConfig';

import { POINT_STYLE, FILL_STYLE, STROKE_STYLE } from '../../layerStyles';

interface OverlayLayerProps {

  config: MapLayerConfig;
  
}

export const OverlayLayer = (props: OverlayLayerProps) => {

  const { config } = props;

  return config.type === 'geojson' ? (
    <MixedGeoJSONLayer 
      id={config.name}
      data={config.url} 
      fillStyle={FILL_STYLE} 
      strokeStyle={STROKE_STYLE} 
      pointStyle={POINT_STYLE} />
  ) : config.type === 'raster' ? (
    <RasterOverlayLayer
      id={config.name}
      url={config.url} />
  ) : null;

}