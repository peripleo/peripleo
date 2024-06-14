import { Feature } from '../../model';

export interface SelectionState<P, F, E> {

  selected: Feature<P> | Feature<P>[];

  mapFeature?: F;

  mapEvent?: E;

}