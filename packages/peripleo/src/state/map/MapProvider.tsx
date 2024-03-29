import { ReactNode, createContext, useState } from 'react';

export interface MapContextValue {

  map: unknown;

  setMap: React.Dispatch<React.SetStateAction<unknown>>;

  loaded: boolean;

  setLoaded: React.Dispatch<React.SetStateAction<unknown>>;

}

export const MapContext = createContext<MapContextValue>(undefined);

export const MapProvider = (props: { children: ReactNode }) => {

  const [map, setMap] = useState<unknown>(undefined);

  const [loaded, setLoaded] = useState(false);

  return (
    <MapContext.Provider value={{ map, setMap, loaded, setLoaded }}>
      {props.children}
    </MapContext.Provider>
  )

}