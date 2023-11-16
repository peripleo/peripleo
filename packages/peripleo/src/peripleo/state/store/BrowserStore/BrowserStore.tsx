import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { Place, Trace, Store } from '../../../Types';
import { createLocalStore } from './createBrowserStore';
import { useSearch } from '../../search';

const BrowserStoreContext = createContext<Store<unknown>>(null);

interface BrowserStoreProps<T extends unknown> {

  children: ReactNode;

  places: Place[];

  traces: Trace<T>[];

}

export const BrowserStore = <T extends unknown>(props: BrowserStoreProps<T>) => {

  const { refreshSearch } = useSearch();

  const { places, traces } = props;

  const [store, setStore] = useState<Store<T>>(null);

  useEffect(() => {
    if (!store) {
      const s = createLocalStore<T>();
      s.setData(places, traces);
      setStore(s);
    } else {
      // Don't re-render empty changes
      if (places.length + traces.length === 0 && store.isEmpty())
        return; 

      store.setData(places, traces);
      refreshSearch();
    }
  }, [places, traces, store]); 

  return ( 
    <BrowserStoreContext.Provider value={store}>
      {props.children}
    </BrowserStoreContext.Provider>
  )

}

export const useStore = <T extends unknown>() => useContext(BrowserStoreContext) as Store<T>;