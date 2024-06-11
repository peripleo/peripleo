import { Map, MapGeoJSONFeature } from 'maplibre-gl';

export interface PopupProps {

  map: Map,

  selected: MapGeoJSONFeature,

  onClose: () => void

}