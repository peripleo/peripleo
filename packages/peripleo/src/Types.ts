export interface Feature<T extends { [key: string]: any } = {}> {

  type: 'Feature',

  id: string,

  properties: T;

  geometry: {

    type: 'Point' | 'Polygon' | 'Polyline',

    coordinates: number[] | number[][] | number[][][];

  }

}

export interface FeatureCollection<T extends { [key: string]: any } = {}> {

  type: 'FeatureCollection',

  features: Feature<T>[];

}

export interface LinkedItem<T extends { [key: string]: any }, L extends Link = Link> {

  id: string;

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