import { atom } from 'recoil';
import { MapSelection } from './MapTypes';

export const selectedState = atom<MapSelection | null>({
  key: 'selected',
  default: null
});