import React, { createContext, useContext, useEffect, useState } from 'react';

import { Search } from './Search';
import { SearchArgs } from './SearchArgs';
import { SearchResult } from './SearchResult';
import { useStore } from '../store';

const SearchContext = createContext();

export const SearchProvider = props => {

  const store = useStore();
  
  const [search, setSearch] = useState(props.initialSearch);

  useEffect(() => {
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

  const updateQuery = query => {
    setSearch(new Search(
      new SearchArgs({...search.args, query }),
      null,
      Search.PENDING));
  }

  const value = { 
    search, 
    setSearch,
    updateQuery
  }

  return <SearchContext.Provider value={value}>{props.children}</SearchContext.Provider>
}

export const useSearch = () => useContext(SearchContext);