import { Annotation } from '@peripleo/peripleo';
import { CoreDataAnnotation } from './CoreDataAnnotation';

export interface CoreDataOrganization extends CoreDataAnnotation {

  type: 'Organization';

  biography: string;

}

export interface OrganizationAnnotation extends Annotation<CoreDataOrganization> { } 

