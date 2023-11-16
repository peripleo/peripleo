import { createContext, useContext, useLayoutEffect, useState } from 'react';
import { DeviceType, Size } from './Types';

const isTouchDevice = (('ontouchstart' in window) ||
  (navigator.maxTouchPoints > 0) ||
  // @ts-ignore
  (navigator.msMaxTouchPoints > 0));

const DeviceStateContext = createContext<DeviceType>({ size: Size.DESKTOP, isTouchDevice });

type DeviceStateProviderProps = {

  children: React.ReactElement

  breakPoint: number

}

export const DeviceStateProvider = (props: DeviceStateProviderProps) => {

  const [device, setDevice] = useState<DeviceType>({
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