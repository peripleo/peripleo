import { Annotation } from '@peripleo/peripleo';
import { CoreDataAnnotation } from './CoreDataAnnotation';

export interface CoreDataMedia extends CoreDataAnnotation {

  type: 'MediaContent';

  content_download_url: string;

  content_iiif_url: string;

  content_preview_url: string;

  content_thumbnail_url: string;

  content_url: string;

  manifest_url: string;

}

export interface MediaAnnotation extends Annotation<CoreDataMedia> { } 

