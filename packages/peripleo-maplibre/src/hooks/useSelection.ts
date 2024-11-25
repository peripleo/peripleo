import { useCallback } from 'react';
import { 
  useSelectionState as useGenericSelectionState,
  useSelectionValue as useGenericSelectionValue
} from '@peripleo/peripleo';
import type { 
  Feature,
  SelectionState as GenericSelectionState
} from '@peripleo/peripleo';
import { MapGeoJSONFeature, MapLayerMouseEvent, MapMouseEvent } from 'maplibre-gl';
import { useMapUtils } from './useMapUtils';

export type SelectionState<T extends Feature> = GenericSelectionState<T, MapGeoJSONFeature, MapMouseEvent>;

// mapLibre-typed version of Peripleo's original useSelectionState
export const useSelectionState = <T extends Feature>() => 
  useGenericSelectionState<T, MapGeoJSONFeature, MapMouseEvent>();

// For convenience: programmatic selection with cluster auto-resolving
export const useSelection = <T extends Feature>() => {
  const utils = useMapUtils();

  const {
    selection,
    setSelection: setGenericSelection 
  } = useGenericSelectionState<T, MapGeoJSONFeature, MapMouseEvent>();

  const setSelected = useCallback((feature: T) => {
    utils.findMapFeature(feature.id).then(mapFeature => {
      if (!mapFeature) {
        console.warn('Attempt to select non-existing feature', feature);
      } else {
        setGenericSelection({ selected: feature, mapFeature });
      }
    })
  }, [utils]);

  return { selection, setSelected };
}

// mapLibre-typed version of Peripleo's useHoverValue
export const useSelectionValue = <T extends Feature>() =>
  useGenericSelectionValue<T, MapGeoJSONFeature, MapLayerMouseEvent>();