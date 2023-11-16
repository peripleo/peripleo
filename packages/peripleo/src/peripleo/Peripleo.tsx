import { ReactNode } from 'react';
import { SelectionProvider,  SearchProvider } from './state';
import { DeviceStateProvider } from './layout';

import './index.css';

export interface PeripleoProps {
  
  children: ReactNode;

  deviceBreakpoint?: number;

}

export const Peripleo = (props: PeripleoProps) => {

  return (
    <DeviceStateProvider breakPoint={props.deviceBreakpoint || 540}>
      <SearchProvider>
        <SelectionProvider>
          {props.children}
        </SelectionProvider>
      </SearchProvider>
    </DeviceStateProvider>
  )

}