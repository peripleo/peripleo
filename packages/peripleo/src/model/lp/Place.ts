import { Feature, FeatureGeometry } from '../Feature';

export interface Place<T extends PlaceProperties = PlaceProperties>{

  '@id': string;

  type: 'Feature';

  properties: T;

  names: Name[];

  geometry: FeatureGeometry;

}

export type PlaceProperties = {

  id: string,

  ccode: string[],

  title: string,

  [key: string]: any

}

export type PlaceFeatureProperties = PlaceProperties & {

  names: Name[]

}

export type Name = {

  toponym: string

}

export const toFeature =  <T extends PlaceFeatureProperties>(place: Place, id: number) =>({
  id,
  type: 'Feature',
  properties: {
    ...place.properties,
    id: place['@id'],
    names: place.names
  },
  geometry: place.geometry
} as Feature<T>)