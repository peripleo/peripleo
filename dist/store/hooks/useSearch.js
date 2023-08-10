import { useRecoilState } from 'recoil';
import { SearchStatus } from '../types';
import { searchState } from '../state';
export const useSearch = () => {
    const [search, setSearchState] = useRecoilState(searchState);
    const runSearch = (args = {}) => setSearchState({ args, status: SearchStatus.PENDING, result: search.result });
    const refreshSearch = () => runSearch({ ...search.args });
    const changeSearchQuery = (query) => runSearch({ ...search.args, query });
    const clearSearchQuery = () => runSearch({ ...search.args, query: undefined });
    const setFilter = (filter) => {
        const updatedFilters = [
            ...(search.args.filters || []).filter(f => f.name !== filter.name),
            filter
        ];
        runSearch({ ...search.args, filters: updatedFilters });
    };
    // Note that switching the facet does not require 
    // a new search run!
    const setActiveAggregation = (name) => setSearchState({
        args: {
            ...search.args,
            activeAggregation: name
        },
        status: search.status,
        result: search.result
    });
    return {
        changeSearchQuery,
        clearSearchQuery,
        refreshSearch,
        search,
        setActiveAggregation,
        setFilter,
        setSearchState
    };
};
//# sourceMappingURL=useSearch.js.map