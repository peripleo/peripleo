import { Feature } from './Feature';

export interface FeatureCollection<T extends { [key: string]: any } = {}> {

  type: 'FeatureCollection',

  features: Feature<T>[];

}