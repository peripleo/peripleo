import { Map } from 'maplibre-gl';
import { Feature } from '../../../model';

export interface PopupProps {

  map: Map,

  selected: Feature,

  onClose: () => void

}