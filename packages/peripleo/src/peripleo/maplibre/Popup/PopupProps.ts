import { Map } from 'maplibre-gl';
import { Feature } from '../../Types';

export interface PopupProps {

  map: Map,

  selected: Feature,

  onClose: () => void

}