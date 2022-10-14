import { MapboxGeoJSONFeature } from 'react-map-gl';
import { Graph, ResultItem } from '../../store';

export interface MapHover {

  x: number

  y: number

  node: any

  feature: MapboxGeoJSONFeature

}

export interface MapSelection extends MapHover { }

export interface ViewState {

  longitude: number

  latitude: number

  zoom: number

  bearing: number

  pitch: number,

  transitionDuration?: number

}

export interface DeckGLLayer {

  (items: ResultItem[], graph: Graph): Object | Object[]

}

