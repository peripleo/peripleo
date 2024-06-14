import { 
  useSelectionState as useGenericSelectionState,
  useSelectionValue as useGenericSelectionValue
} from '@peripleo/peripleo';
import type { 
  Feature,
  SelectionState as GenericSelectionState
} from '@peripleo/peripleo';
import { MapGeoJSONFeature, MapLayerMouseEvent, MapMouseEvent } from 'maplibre-gl';

export type SelectionState<T extends Feature> = GenericSelectionState<T, MapGeoJSONFeature, MapMouseEvent>;

// mapLibre-typed version of Peripleo's useHoverState
export const useSelectionState = <T extends Feature>() => 
  useGenericSelectionState<T, MapGeoJSONFeature, MapMouseEvent>();


// mapLibre-typed version of Peripleo's useHoverValue
export const useSelectionValue = <T extends Feature>() =>
  useGenericSelectionValue<T, MapGeoJSONFeature, MapLayerMouseEvent>();