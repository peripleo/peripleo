export interface Feature {

  id: string;

  type: 'Feature',

  properties: {

    [key: string]: any;

  }

  geometry: {

    type: 'Point' | 'Polygon' | 'Polyline',

    coordinates: number[] | number[][] | number[][][];

  }

}

export interface FeatureCollection {

  type: 'FeatureCollection',

  features: Feature[];

}

export interface Bounds {

  minLon: number;

  minLat: number;

  maxLon: number;

  maxLat: number;

} 

export interface Place extends Feature {

  id: string;

  properties: {

    title: string;

    [key: string]: any

  }

}

export interface Trace<T extends unknown> {

  id: string;

  items: Item<T>[];

}

export interface Item<T extends unknown> {

  id: string;

  type: 'Annotation';

  target: {

    type: 'Dataset';

    value: T;

  }

  body:  {

    type: 'Dataset';

    value: { id: string }[];
    
  }

}

export interface Store<T extends unknown> {

  allItems(): Item<T>[];

  allPlaces(): Place[];

  allTraces(): Trace<T>[];

  getExtent(): Bounds;

  getItemsAt(placeOrId: Place | string): Item<T>[];

  getItemById(id: string): Item<T> | undefined;

  getPlaceById(id: string): Place | undefined;

  getPlacesIntersecting(minLon: number, minLat: number, maxLon: number, maxLat: number): Place[];

  getTracesAt(placeOrId: Place | string): Trace<T>[];

  isEmpty(): boolean;

  minItemsPerPlace: number;

  maxItemsPerPlace: number;

  setData(places: Place[], traces: Trace<T>[], keepExisting?: boolean): void;

}