import React, { createContext, useContext } from 'react';
import { BrowserStore } from './BrowserStore';

const StoreContext = createContext();

export const BrowserStoreProvider = props => {
  const store = new BrowserStore(props.index);

  if (props.nodes) {
    const edges = props.edges || [];
    store.init(props.nodes, edges);
  }

  return <StoreContext.Provider value={store}>{props.children}</StoreContext.Provider>
}

export const RemoteStoreProvider = props => {
  const store = new RemoteStore(props.url);
  return <StoreContext.Provider value={store}>{props.children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext);