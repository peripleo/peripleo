import { Annotation, FeatureGeometry } from '@peripleo/peripleo';
import { CoreDataAnnotation } from './CoreDataAnnotation';

export interface CoreDataPlace extends CoreDataAnnotation {

  type: 'Place';

  geometry: FeatureGeometry;

}

export interface PlaceAnnotation extends Annotation<CoreDataPlace> { 

} 

