import { Feature } from '../../model';

export interface SelectionState<F extends Feature, M, E> {

  selected: F | F[];

  mapFeature?: M;

  mapEvent?: E;

}