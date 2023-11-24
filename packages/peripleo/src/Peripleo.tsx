import { ReactNode } from 'react';
import { HoverProvider, SelectionProvider } from './state';
import { DeviceStateProvider } from './layout';

import './index.css';

export interface PeripleoProps {
  
  children: ReactNode;

  deviceBreakpoint?: number;

}

export const Peripleo = (props: PeripleoProps) => {

  return (
    <DeviceStateProvider breakPoint={props.deviceBreakpoint || 540}>
      <SelectionProvider>
        <HoverProvider>
          {props.children}
        </HoverProvider>
      </SelectionProvider>
    </DeviceStateProvider>
  )

}