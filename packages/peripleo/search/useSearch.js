import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { useStore } from '../store';
import { searchState } from '../state';

export const useSearch = () => {

  const store = useStore();

  const [search, setSearch] = useRecoilState(searchState);

  useEffect(() => {
    console.log('querying the store', search);

    // TODO
  }, [search]);

  return {
    search,
    setSearch
  };

}
