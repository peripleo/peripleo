import { Place } from '@peripleo/peripleo';

export interface CoreDataPlace extends Place {

  user_defined: {

    [key: string]: UserDefinedField

  }

}

export interface UserDefinedField {

  label: string;

  value: string;

}