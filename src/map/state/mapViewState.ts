import { atom } from 'recoil';
import { ViewState } from '../types';

export const mapViewState = atom<ViewState>({
  key: 'mapView',
  default: {} as ViewState
});

export const isValidViewState = (viewState: ViewState) => {
  const { longitude, latitude, zoom } = viewState;
  return longitude && latitude && zoom;
}