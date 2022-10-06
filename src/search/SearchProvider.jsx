import React, { createContext, useContext, useEffect, useState } from 'react';
import { useStore } from '../store';
import { Search } from './Search';
import { SearchArgs } from './SearchArgs';
import { SearchResult } from './SearchResult';

const SearchContext = createContext();

export const SearchProvider = props => {

  const store = useStore();
  
  const [search, setSearch] = useState(props.initialSearch);

  useEffect(() => {
    // Re-run the search if the store was reset
    setSearch(new Search(
      new SearchArgs({...search.args }),
      null,
      Search.PENDING));
  }, [store]);

  useEffect(() => {
    const { query } = search.args;

    const req = query ? 
      store.searchMappable(query) :
      store.getAllLocatedNodes();

    req.then(all => {
      const total = all.reduce((total, node) =>
        total + node.properties.count, 0);

      const result = new SearchResult(total, all);

      setSearch(new Search(
        search.args,
        result, 
        Search.OK));
    });
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