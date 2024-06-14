import { ReactNode, createContext, useContext, useState } from 'react';
import { Feature } from '../../model';
import { SelectionState } from './SelectionState';

export type SelectionContextValue<F extends Feature, M, E> = {

  selected: SelectionState<F, M, E>;

  setSelected: React.Dispatch<React.SetStateAction<SelectionState<F, M, E>>>

}

export const SelectionContext = createContext<SelectionContextValue<any, any, any>>(undefined);

export const SelectionProvider = <F extends Feature, M, E>(props: { children: ReactNode }) => {

  const [selected, setSelected] = useState<SelectionState<F, M, E> | undefined>(undefined);

  return (
    <SelectionContext.Provider value={{ selected, setSelected }}>
      {props.children}
    </SelectionContext.Provider>
  )

}

export const useSelectionState = <F extends Feature, M, E>() => {
  const { selected, setSelected } = useContext(SelectionContext);
  return { selected: selected as SelectionState<F, M, E> | undefined, setSelected: setSelected as React.Dispatch<React.SetStateAction<SelectionState<F, M, E> | undefined>> };
}

export const useSelectionValue = <F extends Feature, M, E>() => {
  const { selected } = useContext(SelectionContext);
  return selected as SelectionState<F, M, E> | undefined;
}