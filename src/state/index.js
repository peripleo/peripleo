import { atom } from 'recoil';
import { initialView } from './URLState';

export const mapViewState = atom({
  key: 'mapView',
  default: initialView
});

export const mapHoverState = atom({
  key: 'mapHover',
  default: null
});

export const selectionState = atom({
  key: 'selection',
  default: null
});