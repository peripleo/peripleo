import { useRecoilState } from 'recoil';
import { mapViewState } from '../state';
import { useMap } from './useMap';

export const useViewState = (debounced: boolean) => {

  const map = useMap();

  const [ viewState, setViewState ] = useRecoilState(mapViewState);

  const getMapBounds = () => {
    if (map)
      return map.getBounds().toArray();
  }

  return { viewState, setViewState, getMapBounds };

}