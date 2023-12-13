import { Feature, FeatureGeometry } from '../Feature';

export interface Place<T extends PlaceProperties = PlaceProperties>{

  '@id': string;

  type: 'Feature';

  properties: T;

  names: Name[];

  geometry: FeatureGeometry;

}

export interface PlaceProperties {

  ccode: string[];

  title: string;

  [key: string]: any;

}

interface PlaceFeatureProperties extends PlaceProperties {

  names: Name[];

}

export interface Name {

  toponym: string;

}

export const toFeature = (place: Place) => ({
  id: place['@id'],
  type: 'Feature',
  properties: {
    ...place.properties,
    names: place.names
  },
  geometry: place.geometry
} as Feature<PlaceFeatureProperties>)