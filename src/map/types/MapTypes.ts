import { MapboxGeoJSONFeature } from 'react-map-gl';

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

}
