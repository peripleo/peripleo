import { atom } from 'recoil';
import { ViewState } from '../types';

export const mapViewState = atom<ViewState>({
  key: 'mapView',
  default: {} as ViewState
});