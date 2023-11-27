import { useState } from 'react';
import { Map } from 'maplibre-gl';
import { Feature } from '../../Types';

export const useFeatureRadioState = (property: string) => {

  const [selected, _setSelected] = useState<{ source: string, feature: Feature } | undefined>();

  // TODO we could avoid re-evaluating this each time if we index on init
  const findSource = (map: Map, feature: Feature) => {
    const style = map?.getStyle();
    if (style?.layers) {
      const layers = style.layers.filter(l => 'interactive' in (l.metadata as object || {}));

      const sourceId: string | undefined = layers.reduce((sourceId, layer) => {
        if (sourceId) 
          return sourceId;

        // @ts-ignore
        const { source } = layer;

        const sourceFeatures = new Set(map.querySourceFeatures(source).map(f => f.id.toString()));
        return sourceFeatures.has(feature.id) ? source as string : undefined;
      }, undefined as string);

      return sourceId;
    }
  }

  const setSelected = (map: Map, feature?: Feature, source?: string) => _setSelected(sel => {
    if (feature?.id === sel?.feature.id) {
      return sel; // No change
    } else {
      // De-activate current active
      if (sel)
        map.setFeatureState({ source: sel.source, id: sel.feature.id }, { [property]: false });

      if (feature) {
        const src = source || findSource(map, feature);

        if (src) {
          map.setFeatureState({ source: src, id: feature.id }, { [property]: true });
          return { source: src, feature };
        }
      }
    }
  });

  // This prevents endless loops when syncing state upwards
  const deferred = (map: Map, feature?: Feature, source?: string) => {
    setTimeout(() => setSelected(map, feature, source), 1);
  }

  return [selected, deferred] as [
    { source: string, feature: Feature } | undefined,
    (map: Map, feature?: Feature, source?: string) => void
  ];

}