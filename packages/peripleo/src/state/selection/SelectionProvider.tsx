import { ReactNode, createContext, useContext, useState } from 'react';
import { Feature } from '../../model';

export type SelectionContextValue = {

  selected: Feature | undefined,

  setSelected: React.Dispatch<React.SetStateAction<Feature>>

}

export const SelectionContext = createContext<SelectionContextValue>(undefined);

export const SelectionProvider = (props: { children: ReactNode }) => {

  const [selected, setSelected] = useState<Feature | undefined>(undefined);

  return (
    <SelectionContext.Provider value={{ selected, setSelected }}>
      {props.children}
    </SelectionContext.Provider>
  )

}

export const useSelectionState = <T extends { id: string } = { id: string }>() => {
  const { selected, setSelected } = useContext(SelectionContext);
  return { selected: selected as Feature<T>, setSelected };
}

export const useSelectionValue = <T extends { id: string } = { id: string }>() => {
  const { selected } = useContext(SelectionContext);
  return selected as Feature<T>;
}