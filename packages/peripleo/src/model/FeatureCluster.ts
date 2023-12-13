import { Feature } from './Feature';

export interface FeatureCluster<T extends { [key: string]: any } = {}> {

  clusterId: string,

  features: Feature<T>[];

}