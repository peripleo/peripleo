import { 
  Place,
  PlaceFeatureProperties,
  toFeature as _toFeature
} from '@peripleo/peripleo';

export interface CoreDataProperties extends PlaceFeatureProperties {

  id: string;

}

export interface CoreDataPlace extends Place {

  user_defined?: { [key: string]: UserDefinedField }

}

export interface UserDefinedField {

  label: string;

  value: string;

}

export const toFeature = (place: CoreDataPlace, recordId: string) => {
  const f = _toFeature<CoreDataProperties>(place);
  return {
    ...f,
    id: recordId,
    properties: {
      ...f.properties,
      id: recordId
    }
  }
}