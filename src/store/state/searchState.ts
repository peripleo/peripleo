import { atom } from 'recoil';
import { SearchState, SearchStatus } from '../types';

export const searchState = atom<SearchState>({
  key: 'search',
  default: { args: {}, status: SearchStatus.OK }
});