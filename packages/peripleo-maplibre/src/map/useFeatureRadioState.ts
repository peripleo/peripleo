import { useState } from 'react';
import { Map, MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl';
import { findSourceForFeature } from './utils';

export const useFeatureRadioState = (property: string) => {

  const [selected, _setSelected] = useState<{ event?: MapMouseEvent, feature: MapGeoJSONFeature, source: string } | undefined>();
  
  const setSelected = (map: Map, event: MapMouseEvent, feature?: MapGeoJSONFeature, source?: string) => _setSelected(sel => {
    if (feature?.id === sel?.feature?.id) {
      return sel; // No change
    } else {
      // De-activate current active
      if (sel) {
        try {
          map.setFeatureState({ source: sel.source, id: sel.feature.id }, { [property]: false });
        } catch (_) {
          // Note that the feature might have been removed meanwhile
        }
      }

      if (feature) {
        const src = source || findSourceForFeature(map, feature.id as number);
        if (src) {
          map.setFeatureState({ source: src, id: feature.id }, { [property]: true });
          return { event, feature, source: src };
        }
      }
    }
  });

  return [selected, setSelected] as [
    { event?: MapMouseEvent, feature: MapGeoJSONFeature, source: string }  | undefined,
    (map: Map, event?: MapMouseEvent, feature?: MapGeoJSONFeature, source?: string) => void
  ];

}