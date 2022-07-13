import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { BiSearch } from 'react-icons/bi';

import { useSearch } from '../../search';

import './SearchInput.css';

export const SearchInput = props => {

  const { search, updateQuery } = useSearch();

  const [query, setQuery] = useState(search?.query || '');

  // State changes as user types
  const onChange = evt => setQuery(evt.target.value);

  // Global search query updates after debouncing the state
  const [debouncedQuery] = useDebounce(query, 250);
  useEffect(() => updateQuery(debouncedQuery), [ debouncedQuery ]);

  const results = search?.result?.items.length || 0;

  return (
    <div className='p6o-search-input-container'>
      <BiSearch />

      <input 
        autoFocus
        spellCheck={false}
        tabIndex={1}
        placeholder={props.placeholder}
        aria-label={props.placeholder}
        value={query}
        onChange={onChange} />

      <div className="p6o-search-result-status">
        {results.toLocaleString('en')} Result{results === 1 ? '' : 's'}
      </div>
    </div>
  )

}