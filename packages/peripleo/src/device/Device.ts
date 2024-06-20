import type { ReactNode } from 'react';
import { useDeviceState } from './DeviceStateProvider';
import { Size } from './Types';

const Desktop = (props: { children: ReactNode }) => {

  const device = useDeviceState();

  return device.size === Size.DESKTOP ? props.children : null;

}

const Mobile = (props: { children: ReactNode }) => {

  const device = useDeviceState();

  return device.size === Size.MOBILE ? props.children : null;

}

export const Device = { Desktop, Mobile }