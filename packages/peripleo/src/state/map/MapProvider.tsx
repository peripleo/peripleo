import { ReactNode, createContext, useState } from 'react';

export type MapContextValue = {

  map: unknown,

  setMap: React.Dispatch<React.SetStateAction<unknown>>

}

export const MapContext = createContext<MapContextValue>(undefined);

export const MapProvider = (props: { children: ReactNode }) => {

  const [map, setMap] = useState<unknown>(undefined)

  return (
    <MapContext.Provider value={{ map, setMap }}>
      {props.children}
    </MapContext.Provider>
  )

}