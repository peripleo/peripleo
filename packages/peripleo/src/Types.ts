export type ID = string;

export interface Feature<T extends { id: ID } = { id: ID }> {

  type: 'Feature',

  properties: T & {

    [key: string]: any;

  }

  geometry: {

    type: 'Point' | 'Polygon' | 'Polyline',

    coordinates: number[] | number[][] | number[][][];

  }

}

export interface FeatureCollection<T extends { id: ID } = { id: ID }> {

  type: 'FeatureCollection',

  features: Feature<T>[];

}

export interface LinkedItem<T extends unknown, L extends Link = Link> {

  id: ID;

  data: T;

  linkedTo: L[];

}

export interface Link<T extends unknown = string> {

  relation: T;

  linkedTo: string;

}

export interface Bounds {

  minLon: number;

  minLat: number;

  maxLon: number;

  maxLat: number;

}