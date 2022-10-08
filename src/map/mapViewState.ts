import { atom } from 'recoil';
import { ViewState } from './MapTypes';

export const mapViewState = atom<ViewState>({
  key: 'mapView',
  default: {} as ViewState
});