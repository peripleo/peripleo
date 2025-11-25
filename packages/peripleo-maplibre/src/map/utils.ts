import { Feature } from '@peripleo/peripleo';
import { GeoJSONSource, Map, MapGeoJSONFeature, MapMouseEvent, PointLike } from 'maplibre-gl';

export const CLICK_THRESHOLD = 3;

export const getFeature = (
  evt: MapMouseEvent, withBuffer?: boolean
) => {
  if (!evt.point) return;

  const map = evt.target;

  const query = withBuffer ? [
    [evt.point.x - CLICK_THRESHOLD, evt.point.y - CLICK_THRESHOLD],
    [evt.point.x + CLICK_THRESHOLD, evt.point.y + CLICK_THRESHOLD]
  ] as [PointLike, PointLike]: evt.point;

  const features = map.queryRenderedFeatures(query)
    .filter(feature => (feature.layer.metadata as any || {}).interactive);

  if (features.length > 0)
    return features[0];
}

/** Tests if a feature is included in the given cluster feature **/
export const isFeatureInCluster = (
  featureId: number, 
  cluster: MapGeoJSONFeature, 
  source: GeoJSONSource
): Promise<boolean> => {
  if (cluster.properties.cluster && source) {
    return source.getClusterLeaves(Number(cluster.id), Infinity, 0)
      .then(features => {
        return Boolean(features.find(f => f.id === featureId))
      })
      .catch(() => false);
  } else {
    return Promise.resolve(false);
  }
}

/** 
 * From a list of clusters, this function finds the cluster
 * that contains the given feature ID.
 */
export const findClusterForFeature = (
  featureId: number, 
  clusters: MapGeoJSONFeature[], 
  source: GeoJSONSource
): Promise<MapGeoJSONFeature | undefined> => clusters.reduce((promise, cluster) =>
  promise.then(found => {
    if (found)
      return found;

    return isFeatureInCluster(featureId, cluster, source).then(included => {
      return included ? cluster : undefined;
    });
  }), Promise.resolve(undefined) as Promise<MapGeoJSONFeature | undefined>);

/**
 * Lists the map features contained in the given cluster.
 */
export const listFeaturesInCluster = (
  map: Map,
  cluster: MapGeoJSONFeature
): Promise<Feature[]> => {
  const { source, properties } = cluster;

  // Under some weird timing conditions (right during load), mapLibre 
  // sometimes returns undefined here!
  const clusterSource = map.getSource(source) as GeoJSONSource;
  
  if (clusterSource) {
    return clusterSource.getClusterLeaves(properties.cluster_id, Infinity, 0)
      .then(features => features.map(f => ({ 
        id: f.id,
        type: f.type, 
        properties: f.properties, 
        geometry: f.geometry 
      }) as Feature));
  } else {
    return Promise.resolve([]);
  }
}

/**
 * Helper: finds the source for a given feature ID.
 */
export const findSourceForFeature = (map: Map, featureId: number) => {
  const interactiveLayers = (map.getStyle()?.layers || [])
    .filter(l => (l.metadata as any || {}).interactive);

  const sourceId: string | undefined = interactiveLayers.reduce((sourceId, layer) => {
    if (sourceId) 
      return sourceId;

    // @ts-ignore
    const { source } = layer;

    const sourceFeatures = new Set(map.querySourceFeatures(source).map(f => f.id));
    return sourceFeatures.has(featureId) ? source as string : undefined;
  }, undefined as string);

  return sourceId;
}

/** 
 * Finds the native MapGeoJSON feature that corresponds to this Feature.
 * This function supports clustering - if the feature is included in a cluster,
 * the method will return the appropriate cluster map feature.
 */
export const findMapFeature = (
  map: Map, 
  featureId?: number
): Promise<MapGeoJSONFeature | undefined> => {
  if (!featureId)
    return Promise.resolve(undefined);

  const source = findSourceForFeature(map, featureId);

  const layers = source
    ? map.getStyle().layers.filter(l => 'source' in l && l.source === source)
    // All interactive layers
    : map.getStyle().layers.filter(l => (l.metadata as any || {}).interactive);
    
  return layers.reduce<Promise<MapGeoJSONFeature | undefined>>((promise, layer) => promise.then(result => {
    if (result)
      return result; // Already found - stop searching

    // @ts-ignore
    const sourceId = layer.source as string;
    const source = map.getSource(sourceId);

    const found = map.querySourceFeatures(sourceId).find(f => f.id === featureId);
    if (found) {
      return found;
    } else if (!found && 'getClusterLeaves' in source) {
      // This is a cluster source - check cluster leaves
      const clusters = map.querySourceFeatures(sourceId).filter(f => f.properties.cluster);
      return findClusterForFeature(featureId, clusters, source as GeoJSONSource);
    }  
  }), Promise.resolve(undefined));
}

export const removeSourceIfExists = (map: Map, sourceId: string) => {
  // If the map is partially unmounted already, style will be undefined,
  // causing a crash
  if (!map.style) return;
  
  try {
    const source = map.getSource(sourceId);
    if (source)
      map.removeSource(sourceId);
  } catch (error) {
    console.error(error);
  }
}

export const removeLayerIfExists = (map: Map, layerId: string) => {
  const layer = map.getStyle()?.layers.find(l => l.id === layerId);
  if (layer)
    map.removeLayer(layerId);
}
