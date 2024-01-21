import { Annotation } from '@peripleo/peripleo';
import { CoreDataAnnotation } from './CoreDataAnnotation';

export interface CoreDataTaxonomy extends CoreDataAnnotation {

  type: 'Taxonomy';

}

export interface TaxonomyAnnotation extends Annotation<CoreDataTaxonomy> { } 

