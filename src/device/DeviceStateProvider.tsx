import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Device } from './Device';

const DeviceStateContext = createContext<Device>(Device.DESKTOP);

type DeviceStateContextProviderProps = {

  children: React.ReactElement

  breakPoint?: number

}

export const DeviceStateContextProvider = (props: DeviceStateContextProviderProps) => {

  const breakPoint = props.breakPoint || 540;

  const [device, setDevice] = useState<Device>(window.innerWidth > breakPoint ? Device.DESKTOP : Device.MOBILE);

  useLayoutEffect(() => {
    const onWindowResize = (evt: UIEvent) => {
      const w = window.innerWidth;

      if (w > breakPoint  && device === Device.MOBILE) {
        setDevice(Device.DESKTOP);
      } else if (w < breakPoint && device === Device.DESKTOP) {
        setDevice(Device.MOBILE);
      }
    }

    window.addEventListener('resize', onWindowResize);

    return () => window.removeEventListener('resize', onWindowResize);
  }, [ device ]);

  return (
    <DeviceStateContext.Provider value={device}>
      {props.children}
    </DeviceStateContext.Provider>
  )
  
}

export const useDeviceState = () => {
  
  return useContext(DeviceStateContext);

}