import { ReactNode, createContext, useContext, useState } from 'react';
import { Feature, ID } from '../../Types';

export type HoverContextState = {

  hover: Feature | undefined,

  setHover: React.Dispatch<React.SetStateAction<Feature>>

}

export const HoverContext = createContext<HoverContextState>(undefined);

export const HoverProvider = (props: { children: ReactNode }) => {

  const [hover, setHover] = useState<Feature | undefined>(undefined);

  return (
    <HoverContext.Provider value={{ hover, setHover }}>
      {props.children}
    </HoverContext.Provider>
  )

}

export const useHoverState = <T extends { id: ID } = { id: ID }>() => {
  const { hover, setHover } = useContext(HoverContext);
  return { hover: hover as Feature<T>, setHover };
}

export const useHoverValue = <T extends { id: ID } = { id: ID }>() => {
  const { hover } = useContext(HoverContext);
  return hover as Feature<T>;
}