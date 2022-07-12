import React, { useEffect } from 'react';
import { RecoilRoot } from 'recoil';

import { Search, useSearch } from './search';

const App = props => {

  const { setSearch } = useSearch();

  useEffect(() => {
    // Run a Search.all() query on initial load
    // TODO make this configurable later?
    setSearch(Search.all());
  }, []);

  return props.children;

}

const Peripleo = props => {

  return (
    <RecoilRoot>
      <App>{props.children}</App>
    </RecoilRoot>
  )

}

export default Peripleo;