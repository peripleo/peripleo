import { useEffect } from 'react';
import { Store } from '../../Types';
import { useStore } from '../store';
import { useSearch } from './useSearch';
import { SearchArgs, SearchResult, SearchStatus } from './SearchTypes';

interface SearchHandlerProps<T extends unknown, S extends unknown> {

  onSearch(arg: { args: SearchArgs, store: Store<T> }): SearchResult<S>;

}

export const SearchHandler = <T extends unknown, S extends unknown>(props: SearchHandlerProps<T, S>) => {

  const store = useStore<T>();

  const { search, setSearch } = useSearch<S>();

  useEffect(() => {
    if (store && !store.isEmpty()) {
      if (search.status === SearchStatus.PENDING) {
        const result = props.onSearch({ args: search.args, store });

        setSearch({
          args: search.args,
          status: SearchStatus.OK,
          result
        });
      }
    }
  }, [props.onSearch, search, setSearch, store]);

  return null;

}