import { 
  Feature,
  Place,
  PlaceFeatureProperties,
  toFeature as _toFeature
} from '@peripleo/peripleo';

export interface CoreDataProperties extends PlaceFeatureProperties {

  id: string;

}

export interface CoreDataPlaceFeature extends Place {
  
  record_id: string;

  user_defined?: { [key: string]: UserDefinedField }

}

export interface UserDefinedField {

  label: string;

  value: string;

}

export const toFeature = (place: CoreDataPlaceFeature, uuid: string): Feature<CoreDataProperties> => {
  const f = _toFeature<CoreDataProperties>(place, parseInt(place.record_id));
  return {
    ...f,
    properties: {
      ...f.properties,
      record_id: place.record_id,
      uuid
    }
  }
}