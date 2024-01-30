import { Feature } from './Feature';

export type FeatureCollection<T extends { [key: string]: any } = {}> = {

  type: 'FeatureCollection',

  features: Feature<T>[]

}