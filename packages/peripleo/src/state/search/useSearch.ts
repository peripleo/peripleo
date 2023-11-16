import { useContext } from 'react';
import { SearchContext } from './SearchProvider';
import { Filter, SearchArgs, SearchState, SearchStatus } from './SearchTypes';

export const useSearch = <T extends unknown>() => {

  const { search, setSearch } = useContext(SearchContext);

  const runSearch = (args: SearchArgs = {}) =>
    setSearch({ args, status: SearchStatus.PENDING, result: search.result });

  const refreshSearch = () =>
    runSearch({ ...search.args });

  const changeSearchQuery = (query: string) => 
    runSearch({ ...search.args, query });

  const clearSearchQuery = () => 
    runSearch({ ...search.args, query: undefined });

  const setFilter = (filter: Filter) => {
    const updatedFilters = [
      ...(search.args.filters || []).filter(f => f.name !== filter.name),
      filter
    ];

    runSearch({ ...search.args, filters: updatedFilters });
  };

  const clearFilter = (filterName: string) => {
    const updatedFilters = [
      ...(search.args.filters || []).filter(f => f.name !== filterName)
    ];

    runSearch({ ...search.args, filters: updatedFilters });
  };

  const getFilter = (name: string) =>
    search.args.filters?.find(f => f.name === name);

  // Note that switching the facet does not require 
  // a new search run!
  const setActiveAggregation = (name: string) => 
    setSearch({ 
      args: {
        ...search.args,
        activeAggregation: name
      }, 
      status: search.status,
      result: search.result 
    });

  return {
    changeSearchQuery,
    clearFilter,
    clearSearchQuery,
    getFilter,
    refreshSearch,
    search: search as SearchState<T>,
    setActiveAggregation,
    setFilter,
    setSearch
  };

}