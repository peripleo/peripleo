import { ReactNode, createContext, useState } from 'react';
import { SearchState, SearchStatus } from './SearchTypes';

const EMPTY = { args: {}, status: SearchStatus.PENDING };

interface SearchContextValue<T extends unknown = unknown>{

  search: SearchState<T>;

  setSearch: React.Dispatch<React.SetStateAction<SearchState<T> | null>>;

}

export const SearchContext = createContext<SearchContextValue>({ search: EMPTY, setSearch: null });

export const SearchProvider = <T extends { id: string}>(props: { children: ReactNode }) => {

  const [search, setSearch]  = useState<SearchState<T>>(EMPTY);

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      {props.children}
    </SearchContext.Provider>
  )

}