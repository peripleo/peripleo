import { 
  Feature, 
  Place,
  PlaceFeatureProperties,
  toFeature as _toFeature
} from '@peripleo/peripleo';

export interface CoreDataProperties extends PlaceFeatureProperties {

  id: string;

}

export const toFeature = (place: Place, recordId: string) => {
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