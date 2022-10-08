import { atom } from 'recoil';
import { MapSelection } from '../types';

export const selectedState = atom<MapSelection | null>({
  key: 'selected',
  default: null
});