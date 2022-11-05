import React, { createContext, useContext, useLayoutEffect, useState } from 'react';
import { Device, Size } from './Device';

const isTouchDevice = (('ontouchstart' in window) ||
  (navigator.maxTouchPoints > 0) ||
  // @ts-ignore
  (navigator.msMaxTouchPoints > 0));

const DeviceStateContext = createContext<Device>({ size: Size.DESKTOP, isTouchDevice });

type DeviceStateContextProviderProps = {

  children: React.ReactElement

  breakPoint: number

}

export const DeviceStateContextProvider = (props: DeviceStateContextProviderProps) => {

  const [device, setDevice] = useState<Device>({
    size: window.innerWidth > props.breakPoint ? Size.DESKTOP : Size.MOBILE, 
    isTouchDevice
  });

  useLayoutEffect(() => {
    const onWindowResize = (evt: UIEvent) => {
      const w = window.innerWidth;

      if (w > props.breakPoint  && device.size === Size.MOBILE) {
        setDevice({ ...device, size: Size.DESKTOP });
      } else if (w < props.breakPoint && device.size === Size.DESKTOP) {
        setDevice({ ...device, size: Size.MOBILE });
      }
    }

    window.addEventListener('resize', onWindowResize);

    return () => window.removeEventListener('resize', onWindowResize);
  }, [ props.breakPoint, device ]);

  return (
    <DeviceStateContext.Provider value={device}>
      {props.children}
    </DeviceStateContext.Provider>
  )
  
}

export const useDeviceState = () => {
  
  return useContext(DeviceStateContext);

}