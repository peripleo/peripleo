import { ReactNode, createContext, useContext, useState } from 'react';
import { Feature } from '../../model';
import { SelectionState } from './SelectionState';

export type SelectionContextValue<P, F, E> = {

  selected: SelectionState<P, F, E>;

  setSelected: React.Dispatch<React.SetStateAction<SelectionState<P, F, E>>>

}

export const SelectionContext = createContext<SelectionContextValue<any, any, any>>(undefined);

export const SelectionProvider = <P, F, E>(props: { children: ReactNode }) => {

  const [selected, setSelected] = useState<SelectionState<P, F, E> | undefined>(undefined);

  return (
    <SelectionContext.Provider value={{ selected, setSelected }}>
      {props.children}
    </SelectionContext.Provider>
  )

}

export const useSelectionState = <P, F, E>() => {
  const { selected, setSelected } = useContext(SelectionContext);
  return { selected: selected as SelectionState<P, F, E> | undefined, setSelected: setSelected as React.Dispatch<React.SetStateAction<SelectionState<P, F, E> | undefined>> };
}

export const useSelectionValue = <P, F, E>() => {
  const { selected } = useContext(SelectionContext);
  return selected as SelectionState<P, F, E> | undefined;
}