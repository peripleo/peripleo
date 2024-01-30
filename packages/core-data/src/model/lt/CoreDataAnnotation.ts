export interface CoreDataAnnotation {

  id: string;

  record_id: string;

  uuid: string;

  title: string;

  user_defined: {

    [key: string]: string;

  }

}