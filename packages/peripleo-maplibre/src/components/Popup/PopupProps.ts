import { Map } from 'maplibre-gl';
import { Feature } from '../../../../peripleo/src/model';

export interface PopupProps {

  map: Map,

  selected: Feature,

  onClose: () => void

}