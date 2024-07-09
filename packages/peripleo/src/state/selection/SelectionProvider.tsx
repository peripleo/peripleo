import { ReactNode, createContext, useContext, useState } from 'react';
import { Feature } from '../../model';
import { SelectionState } from './SelectionState';

export type SelectionContextValue<F extends Feature, M, E> = {

  selection: SelectionState<F, M, E>;

  setSelection: React.Dispatch<React.SetStateAction<SelectionState<F, M, E>>>

}

export const SelectionContext = createContext<SelectionContextValue<any, any, any>>(undefined);

export const SelectionProvider = <F extends Feature, M, E>(props: { children: ReactNode }) => {

  const [selection, setSelection] = useState<SelectionState<F, M, E> | undefined>(undefined);

  return (
    <SelectionContext.Provider value={{ selection, setSelection }}>
      {props.children}
    </SelectionContext.Provider>
  )

}

export const useSelectionState = <F extends Feature, M, E>() => {
  const { selection, setSelection } = useContext(SelectionContext);
  return { selection: selection as SelectionState<F, M, E> | undefined, setSelection: setSelection as React.Dispatch<React.SetStateAction<SelectionState<F, M, E> | undefined>> };
}

export const useSelectionValue = <F extends Feature, M, E>() => {
  const { selection } = useContext(SelectionContext);
  return selection as SelectionState<F, M, E> | undefined;
}