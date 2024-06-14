import { ReactNode, createContext, useContext, useState } from 'react';
import { HoverState } from './HoverState';
import { Feature } from 'src/model';

export interface HoverContextValue<F extends Feature, M, E> {

  hover?: HoverState<F, M, E>;

  setHover: React.Dispatch<React.SetStateAction<HoverState<F, M, E>>>;

}

export const HoverContext = createContext<HoverContextValue<any, any, any>>(undefined);

export const HoverProvider = <F extends Feature, M, E>(props: { children: ReactNode }) => {

  const [hover, setHover] = useState<HoverState<F, M, E> | undefined>(undefined);

  return (
    <HoverContext.Provider value={{ hover, setHover }}>
      {props.children}
    </HoverContext.Provider>
  )

}

export const useHoverState = <F extends Feature, M, E>() => {
  const { hover, setHover } = useContext(HoverContext);
  return { hover: hover as HoverState<F, M, E> | undefined, setHover: setHover as React.Dispatch<React.SetStateAction<HoverState<F, M, E> | undefined>> };
}

export const useHoverValue = <F extends Feature, M, E>() => {
  const { hover } = useContext(HoverContext);
  return hover as HoverState<F, M, E> | undefined;
}