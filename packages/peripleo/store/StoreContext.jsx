import React, { createContext, useContext } from 'react';
import { Store } from './Store';

const StoreContext = createContext();

export const StoreContextProvider = ({ children }) => {
  const value = { store: new Store() };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext).store;