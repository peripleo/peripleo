import { Annotation } from './Annotation';

export type AnnotationPage<T extends unknown> = {

  '@context': 'http://www.w3.org/ns/anno.jsonld',

  id: string,

  type: 'AnnotationPage',

  partOf: {

    id: string,

    label: string,

    total: number

  }

  items: Annotation<T>[]

}