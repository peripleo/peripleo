import { Annotation } from '@peripleo/peripleo';
import { CoreDataAnnotation } from './CoreDataAnnotation';

export interface CoreDataPlace extends CoreDataAnnotation {

  type: 'Place';

}

export interface PlaceAnnotation extends Annotation<CoreDataPlace> { } 

