import { 
  useHoverState as useGenericHoverState,
  useHoverValue as useGenericHoverValue,
} from '@peripleo/peripleo';
import type { 
  Feature,
  HoverState as GenericHoverState
} from '@peripleo/peripleo';
import { MapGeoJSONFeature, MapLayerMouseEvent, MapMouseEvent } from 'maplibre-gl';

export type HoverState<T extends Feature> = GenericHoverState<T, MapGeoJSONFeature, MapMouseEvent>;

// mapLibre-typed version of Peripleo's useHoverState
export const useHoverState = <T extends Feature>() => 
  useGenericHoverState<T, MapGeoJSONFeature, MapMouseEvent>();


// mapLibre-typed version of Peripleo's useHoverValue
export const useHoverValue = <T extends Feature>() =>
  useGenericHoverValue<T, MapGeoJSONFeature, MapLayerMouseEvent>();