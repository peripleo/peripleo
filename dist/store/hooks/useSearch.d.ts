import { Filter } from '../types';
export declare const useSearch: () => {
    changeSearchQuery: (query: string) => void;
    clearSearchQuery: () => void;
    refreshSearch: () => void;
    search: import("../types").SearchState;
    setActiveAggregation: (name: string) => void;
    setFilter: (filter: Filter) => void;
    setSearchState: import("recoil").SetterOrUpdater<import("../types").SearchState>;
};
//# sourceMappingURL=useSearch.d.ts.map