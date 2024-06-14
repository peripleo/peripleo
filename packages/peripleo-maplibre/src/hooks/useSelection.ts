import { 
  Feature,
  useSelectionState as useGenericSelectionState,
  useSelectionValue as useGenericSelectionValue
} from '@peripleo/peripleo';
import { MapGeoJSONFeature, MapLayerMouseEvent, MapMouseEvent } from 'maplibre-gl';

// mapLibre-typed version of Peripleo's useHoverState
export const useSelectionState = <T extends Feature>() => 
  useGenericSelectionState<T, MapGeoJSONFeature, MapMouseEvent>();


// mapLibre-typed version of Peripleo's useHoverValue
export const useSelectionValue = <T extends Feature>() =>
  useGenericSelectionValue<T, MapGeoJSONFeature, MapLayerMouseEvent>();