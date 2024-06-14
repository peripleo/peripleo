import { ReactNode, createContext, useContext, useState } from 'react';
import { HoverState } from './HoverState';

export interface HoverContextValue<P, F, E> {

  hover?: HoverState<P, F, E>;

  setHover: React.Dispatch<React.SetStateAction<HoverState<P, F, E>>>;

}

export const HoverContext = createContext<HoverContextValue<any, any, any>>(undefined);

export const HoverProvider = <P, F, E>(props: { children: ReactNode }) => {

  const [hover, setHover] = useState<HoverState<P, F, E> | undefined>(undefined);

  return (
    <HoverContext.Provider value={{ hover, setHover }}>
      {props.children}
    </HoverContext.Provider>
  )

}

export const useHoverState = <P, F, E>() => {
  const { hover, setHover } = useContext(HoverContext);
  return { hover: hover as HoverState<P, F, E> | undefined, setHover: setHover as React.Dispatch<React.SetStateAction<HoverState<P, F, E> | undefined>> };
}

export const useHoverValue = <P, F, E>() => {
  const { hover } = useContext(HoverContext);
  return hover as HoverState<P, F, E> | undefined;
}