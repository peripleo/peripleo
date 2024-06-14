import { Feature } from '../../model';

export interface HoverState<F extends Feature, M, E> {

  hovered: F | F[];

  mapFeature?: M;

  mapEvent?: E;

}