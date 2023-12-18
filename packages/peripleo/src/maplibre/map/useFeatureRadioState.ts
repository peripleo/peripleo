import { useState } from 'react';
import { Map, MapGeoJSONFeature } from 'maplibre-gl';
import { findSourceForFeature } from './clusterUtils';

export const useFeatureRadioState = (property: string) => {

  const [selected, _setSelected] = useState<{ source: string, feature: MapGeoJSONFeature } | undefined>();
  
  const setSelected = (map: Map, feature?: MapGeoJSONFeature, source?: string) => _setSelected(sel => {
    if (feature?.id === sel?.feature?.id) {
      return sel; // No change
    } else {
      // De-activate current active
      if (sel)
        map.setFeatureState({ source: sel.source, id: sel.feature.id }, { [property]: false });

      if (feature) {
        const src = source || findSourceForFeature(map, feature.id.toString());

        if (src) {
          map.setFeatureState({ source: src, id: feature.id }, { [property]: true });
          return { source: src, feature };
        }
      }
    }
  });

  return [selected, setSelected] as [
    { source: string, feature: MapGeoJSONFeature }  | undefined,
    (map: Map, feature?: MapGeoJSONFeature, source?: string) => void
  ];

}