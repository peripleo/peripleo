export type Feature<T extends { [key: string]: any } = {}> = {

  // Unfortunately, we need to require an (integer) number here, because this
  // is what mapLibre needs. Without mapLibre-compliant int IDs, there's no way
  // to get hover + selection working efficiently. More on this here:
  // https://github.com/maplibre/maplibre-gl-js/issues/1043#issuecomment-1739141562
  id: number,

  type: 'Feature',

  properties: T,

  geometry: FeatureGeometry

}

export type FeatureGeometry = {

  type: 'Point' | 'Polygon' | 'Polyline' | 'GeometryCollection',

  coordinates: number[] | number[][] | number[][][]

}