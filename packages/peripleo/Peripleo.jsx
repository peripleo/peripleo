import React from 'react';

import { StoreContextProvider, useStore } from './store';

const App = props => {

  const store = useStore();

  if (props.nodes) {
    const edges = props.edges || [];
    store.init(props.nodes, edges);
  }

  return props.children;

}

const Peripleo = props => {

  return (
    <StoreContextProvider>
      <App {...props}>
        {props.children}
      </App>
    </StoreContextProvider>
  )

}

export default Peripleo;