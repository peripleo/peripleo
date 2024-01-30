import { Feature } from './Feature';

export type FeatureCluster<T extends { [key: string]: any } = {}> = {

  clusterId: number,

  features: Feature<T>[]

}