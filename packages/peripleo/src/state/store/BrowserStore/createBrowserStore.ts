import bbox from '@turf/bbox';
import { Item, Place, Trace, Store, Bounds } from '../../../Types';

// Shorthand
const normalizeURL = (url: string) => url.replace('https', 'http');

// Various data normalization ops
const normalizePlace = (p: Place): Place => {
  // LP has the non-GeoJSON quirk that it uses @id 
  // instead of id -> fix
  let id = p.id || p['@id'];

  // Also: normalize all URIs to http, since people handle
  // them differently. Places may use http, traces https, which
  // then breaks stuff -> fix
  id = normalizeURL(id);

  p.id = id;
  delete p['@id'];

  // Copy the ID into the properties, since mapLibre will
  // erase the ID from the top level when adding the feature
  // to the map
  p.properties.id = id;

  return p;
}

export const createLocalStore = <T extends unknown>(): Store<T> => {

  // All places by ID
  const places = new Map<string, Place>();

  // List of items by trace ID
  const traces = new Map<string, Trace<T>>();

  // All items by ID, as a tuple [item, trace ID]
  const items = new Map<string, { item: Item<T>, trace: string }>();

  // Links items to places via place ID
  const itemsAt = new Map<string, Item<T>[]>();

  const extent = { 
    minLon: 0,
    minLat: 0,
    maxLon: 0,
    maxLat: 0
  };

  const allItems = (): Item<T>[] =>
    [...items.values()].map(t => t.item);

  const allPlaces = (): Place[] =>
    ([...places.values()]);

  const allTraces = (): Trace<T>[] =>
    ([...traces.values()]);

  const getExtent = (): Bounds => ({ ...extent });

  const getItemsAt = (placeOrId: Place | string): Item<T>[] => {
    const id = typeof placeOrId === 'string' ? placeOrId : placeOrId.id;
    return [...(itemsAt.get(id) || [])];
  }

  const getItemById = (id: string) => items.get(id)?.item;

  const getPlaceById = (id: string) => places.get(id);

  const getPlacesIntersecting = (minLon: number, minLat: number, maxLon: number, maxLat: number): Place[] => null;

  const getTracesAt = (placeOrId: Place | string): Trace<T>[] => null;

  const isEmpty = () => places.size === 0;

  const setData = (p: Place[], t: Trace<T>[], keepExisting = false) => {
    if (!keepExisting) {
      places.clear();
      items.clear();
    }

    // Remove unlocated places
    const located = p.filter(p => Boolean(p.geometry));
    located.forEach(normalizePlace);
    
    // Store located places
    located.forEach(place => places.set(place.id, place));

    // Compute extent
    if (located.length > 0) {
      const [ minLon, minLat, maxLon, maxLat ] = 
        bbox({ type: 'FeatureCollection', features: located });
      
      extent.minLon = minLon;
      extent.minLat = minLat;
      extent.maxLon = maxLon;
      extent.maxLat = maxLat;
    }

    // Store traces
    t.forEach(t => traces.set(t.id, t));

    // Store items
    t.forEach(t => t.items.forEach(item => items.set(item.id, { item, trace: t.id })));

    // Store links item -> place
    t.forEach(t => t.items.forEach(item => {
      item.body.value
        .map(v => places.get(normalizeURL(v.id)))
        .filter(p => Boolean(p))
        .forEach(p => {
          const other = itemsAt.get(p.id) || [];
          itemsAt.set(p.id, [...other, item]);
        });
    }));
  }

  return {
    allItems,
    allPlaces,
    allTraces,
    getExtent,
    getItemsAt,
    getItemById,
    getPlaceById,
    getPlacesIntersecting,
    getTracesAt,
    isEmpty,
    minItemsPerPlace: 0,
    maxItemsPerPlace: 0,
    setData
  };

}