import React from 'react';
import { Device } from './Device';
declare type DeviceStateContextProviderProps = {
    children: React.ReactElement;
    breakPoint: number;
};
export declare const DeviceStateContextProvider: (props: DeviceStateContextProviderProps) => JSX.Element;
export declare const useDeviceState: () => Device;
export {};
//# sourceMappingURL=DeviceStateProvider.d.ts.map