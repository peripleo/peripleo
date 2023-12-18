import { Feature } from '@peripleo/peripleo';

export interface TypeSenseSearchResult {

  id: string;

  record_id: string;

  type: string;

  name: string;

  names: string[];

  geometry: {

    type: 'Point',

    coordinates: [ number, number ];

  }

}

export const toFeature = (result: TypeSenseSearchResult): Feature => ({
  id: result.record_id,
  type: 'Feature',
  properties: {
    name: result.name,
    names: result.names, 
    record_id: result.record_id, 
    type: result.type
  },
  geometry: result.geometry
})