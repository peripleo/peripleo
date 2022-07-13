import { atom } from 'recoil';

import { initialView } from './URLState';

export const mapViewState = atom({
  key: 'mapView',
  default: initialView
});