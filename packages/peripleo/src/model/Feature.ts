export interface Feature<T extends { [key: string]: any } = {}> {

  type: 'Feature',

  id: string,

  properties: T;

  geometry: FeatureGeometry;

}

export interface FeatureGeometry {

  type: 'Point' | 'Polygon' | 'Polyline',

  coordinates: number[] | number[][] | number[][][];

}