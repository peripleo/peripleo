export interface CoreDataAnnotation {

  id: string;

  record_id: string;

  title: string;

  user_defined: {

    [key: string]: string;

  }

}