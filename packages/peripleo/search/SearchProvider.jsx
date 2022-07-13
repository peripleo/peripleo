import React, { createContext, useContext, useEffect, useState } from 'react';

import { Search } from './Search';
import { SearchResult } from './SearchResult';
import { useStore } from '../store';

const SearchContext = createContext();

export const SearchProvider = props => {

  const store = useStore();
  
  const [search, setSearch] = useState(props.search);

  useEffect(() => {
    if (!search) 
      return;

    const { query } = search.args;

    const all = query ? 
      store.searchMappable(query) :
      store.getAllLocatedNodes();

    // TODO

    const result = new SearchResult(all);

    setSearch(new Search(
      search.args,
      result, 
      Search.OK));
  }, [ search?.args ]);

  const value = { 
    search, 
    setSearch 
  }

  return <SearchContext.Provider value={value}>{props.children}</SearchContext.Provider>
}

export const useSearch = () => useContext(SearchContext);