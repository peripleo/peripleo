import { Feature } from './Feature';

export interface FeatureCluster<T extends { [key: string]: any } = {}> {

  clusterId: number,

  features: Feature<T>[];

}