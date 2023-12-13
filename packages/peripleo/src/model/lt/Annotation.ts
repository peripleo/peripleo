export interface Annotation<T extends unknown> {

  type: 'Annotation'

  id: string;

  created: string;

  motivation: 'describing';

  body: T;

  target: {

    id: string;

    title: string;

  }

}