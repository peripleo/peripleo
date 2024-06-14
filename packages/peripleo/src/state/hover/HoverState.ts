import { Feature } from '../../model';

export interface HoverState<P, F, E> {

  hovered: Feature<P> | Feature<P>[];

  mapFeature?: F;

  mapEvent?: E;

}