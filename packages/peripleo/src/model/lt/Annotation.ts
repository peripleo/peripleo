export type Annotation<T extends unknown> = {

  type: 'Annotation',

  id: string,

  created: string,

  motivation: 'describing' | 'linking',

  body: T,

  target: {

    id: string,

    name: string,

    type?: string

  }

}