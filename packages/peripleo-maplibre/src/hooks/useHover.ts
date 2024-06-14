import { 
  useHoverState as useGenericHoverState,
  useHoverValue as useGenericHoverValue
} from '@peripleo/peripleo';
import { MapGeoJSONFeature, MapLayerMouseEvent, MapMouseEvent } from 'maplibre-gl';

// mapLibre-typed version of Peripleo's useHoverState
export const useHoverState = <T>() => 
  useGenericHoverState<T, MapGeoJSONFeature, MapMouseEvent>();


// mapLibre-typed version of Peripleo's useHoverValue
export const useHoverValue = <T>() =>
  useGenericHoverValue<T, MapGeoJSONFeature, MapLayerMouseEvent>();