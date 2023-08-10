import React, { createContext, useContext, useLayoutEffect, useState } from 'react';
import { Size } from './Device';
const isTouchDevice = (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    // @ts-ignore
    (navigator.msMaxTouchPoints > 0));
const DeviceStateContext = createContext({ size: Size.DESKTOP, isTouchDevice });
export const DeviceStateContextProvider = (props) => {
    const [device, setDevice] = useState({
        size: window.innerWidth > props.breakPoint ? Size.DESKTOP : Size.MOBILE,
        isTouchDevice
    });
    useLayoutEffect(() => {
        const onWindowResize = (evt) => {
            const w = window.innerWidth;
            if (w > props.breakPoint && device.size === Size.MOBILE) {
                setDevice({ ...device, size: Size.DESKTOP });
            }
            else if (w < props.breakPoint && device.size === Size.DESKTOP) {
                setDevice({ ...device, size: Size.MOBILE });
            }
        };
        window.addEventListener('resize', onWindowResize);
        return () => window.removeEventListener('resize', onWindowResize);
    }, [props.breakPoint, device]);
    return (React.createElement(DeviceStateContext.Provider, { value: device }, props.children));
};
export const useDeviceState = () => {
    return useContext(DeviceStateContext);
};
//# sourceMappingURL=DeviceStateProvider.js.map