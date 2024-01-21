import { Annotation } from '@peripleo/peripleo';
import { CoreDataAnnotation } from './CoreDataAnnotation';

export interface CoreDataPerson extends CoreDataAnnotation {

  id: string;

  type: 'Person';

  record_id: string;

  title: string;

  biography: string;

}

export interface PersonAnnotation extends Annotation<CoreDataPerson> { } 

