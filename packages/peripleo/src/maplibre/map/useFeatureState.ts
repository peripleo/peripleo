import { useState } from 'react';
import { GeoJSONSource, Map, MapGeoJSONFeature } from 'maplibre-gl';
import { Feature } from '../../model';

export const useFeatureRadioState = (property: string) => {

  const [selected, _setSelected] = useState<{ 
    source: string, 
    feature: MapGeoJSONFeature
  } | undefined>();

  // Tests if a feature is included in the given cluster feature
  const isFeatureInCluster = (
    feature: Feature, 
    cluster: MapGeoJSONFeature, 
    source: GeoJSONSource
  ): Promise<boolean> => new Promise(resolve => {
    if (cluster.properties.cluster && source) {
      source.getClusterLeaves(Number(cluster.id), Infinity, 0, (error, features) => {
        if (error) {
          console.error(error);
          resolve(false);
        } else {
          resolve(Boolean(features.find(f => f.id.toString() === feature.id.toString())));
        }
      });
    } else {
      resolve(false);
    }
  });

  // From a list of clusters, this function finds the cluster
  // that contains the given feature
  const findClusterForFeature = (
    feature: Feature, 
    clusters: MapGeoJSONFeature[], 
    source: GeoJSONSource
  ): Promise<MapGeoJSONFeature | undefined> => clusters.reduce((promise, cluster) =>
    promise.then(found => {
      if (found)
        return found;

      return isFeatureInCluster(feature, cluster, source).then(included => {
        return included ? cluster : undefined;
      });
    }), Promise.resolve(undefined) as Promise<MapGeoJSONFeature | undefined>);
    
  // Finds the native MapGeoJSON feature that corresponds to this Feature.
  // This function supports clustering - if the feature is included in a cluster,
  // the method will return the appropriate cluster map feature.
  const findMapFeature = (
    map: Map, 
    feature?: Feature,
    source?: string
  ): Promise<{ source: string, f: MapGeoJSONFeature } | undefined> => {
    if (!feature)
      return Promise.resolve(undefined);
    
    const layers = source
      ? map.getStyle().layers.filter(l => 'source' in l && l.source === source)
      // All interactive layers
      : map.getStyle().layers.filter(l => 'interactive' in (l.metadata as object || {}));

    return layers.reduce((promise, layer) => promise.then(result => {
      if (result)
        return result; // Already found - stop searching

      // @ts-ignore
      const sourceId = layer.source as string;
      const source = map.getSource(sourceId);

      const found = map.querySourceFeatures(sourceId).find(f => f.id.toString() === feature.id.toString());
      if (found) {
        return { source: sourceId, f: found };
      } else if (!found && 'getClusterLeaves' in source) {
        // This is a cluster source - check cluster leaves
        const clusters = map.querySourceFeatures(sourceId).filter(f => f.properties.cluster);
        return findClusterForFeature(feature, clusters, source as GeoJSONSource).then(cluster =>
          cluster ? ({ source: sourceId, f: cluster }) : undefined);
      }  
    }), Promise.resolve(undefined) as Promise<{ source: string, f: MapGeoJSONFeature } | undefined>);
  }

  const setSelected = (map: Map, feature?: Feature, source?: string) => {
    findMapFeature(map, feature, source).then(result => _setSelected(sel => {
      if (feature?.id === sel?.feature?.id)
        return sel; // No change

      // De-activate current active
      if (sel)
        map.setFeatureState({ source: sel.source, id: sel.feature.id }, { [property]: false });
  
      if (result) {
        const { source, f } = result;
        map.setFeatureState({ source, id: f.id }, { [property]: true });
        return { source, feature: f };
      } else if (feature) {
        console.warn('No map feature found for', feature);
      }
    }));
  }

  return [selected, setSelected] as [
    { source: string, feature: Feature } | undefined,
    (map: Map, feature?: Feature, source?: string) => void
  ];

}