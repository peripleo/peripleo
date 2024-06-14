export type Feature<T extends { [key: string]: any } = {}> = {

  // Peripleo requires (integer) number here because of the vector tile spec!
  id: number,

  type: 'Feature',

  properties: T,

  geometry: FeatureGeometry

}

export type FeatureGeometry = {

  type: 'Point' | 'Polygon' | 'Polyline' | 'GeometryCollection',

  coordinates: number[] | number[][] | number[][][]

}