import { Feature } from '@peripleo/peripleo';

export interface TypeSenseSearchResult {

  uuid: string;

  record_id: string;

  type: string;

  name: string;

  names: string[];

  coordinates: number[];

  geometry: {

    type: 'Point' | 'GeometryCollection',

    coordinates: [ number, number ];

  }

}

export const toFeature = (result: TypeSenseSearchResult): Feature => ({
  id: parseInt(result.record_id),
  type: 'Feature',
  properties: {
    uuid: result.uuid,     
    record_id: result.record_id,
    name: result.name,
    names: result.names,
    type: result.type
  },
  geometry: {
    type: 'Point',
    coordinates: result.coordinates.slice().reverse()
  }
} as Feature);
