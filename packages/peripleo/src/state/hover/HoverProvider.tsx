import { ReactNode, createContext, useContext, useState } from 'react';
import { Feature } from '../../model';

export type HoverContextValue = {

  hover: Feature | undefined,

  setHover: React.Dispatch<React.SetStateAction<Feature>>

}

export const HoverContext = createContext<HoverContextValue>(undefined);

export const HoverProvider = (props: { children: ReactNode }) => {

  const [hover, setHover] = useState<Feature | undefined>(undefined);

  return (
    <HoverContext.Provider value={{ hover, setHover }}>
      {props.children}
    </HoverContext.Provider>
  )

}

export const useHoverState = <T extends { id: string } = { id: string }>() => {
  const { hover, setHover } = useContext(HoverContext);
  return { hover: hover as Feature<T>, setHover };
}

export const useHoverValue = <T extends { id: string } = { id: string }>() => {
  const { hover } = useContext(HoverContext);
  return hover as Feature<T>;
}