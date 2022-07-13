import React from 'react';
import { RecoilRoot } from 'recoil';

import { Search, SearchProvider } from './search';

const Peripleo = props => {

  return (
    <RecoilRoot>
      <SearchProvider initialSearch={Search.all()}>
        {props.children}
      </SearchProvider>
    </RecoilRoot>
  )

}

export default Peripleo;