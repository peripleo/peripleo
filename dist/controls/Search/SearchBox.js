import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { BiSearch } from 'react-icons/bi';
import { useSearch } from '../../store';
import './SearchBox.css';
export const SearchBox = (props) => {
    const { search, changeSearchQuery } = useSearch();
    const [query, setQuery] = useState(search.args.query || '');
    // State changes as user types
    const onChange = (evt) => setQuery(evt.target.value);
    // Global search query updates after debouncing the state
    const [debouncedQuery] = useDebounce(query, 250);
    useEffect(() => changeSearchQuery(debouncedQuery), [debouncedQuery]);
    const results = search.result?.total || 0;
    return (React.createElement("div", { className: "p6o-searchbox-container" },
        React.createElement(BiSearch, null),
        React.createElement("input", { autoFocus: true, spellCheck: false, tabIndex: 1, placeholder: props.placeholder, "aria-label": props.placeholder, value: query, onChange: onChange }),
        React.createElement("div", { className: "p6o-search-result-status" },
            results.toLocaleString('en'),
            " Result",
            results === 1 ? '' : 's')));
};
//# sourceMappingURL=SearchBox.js.map