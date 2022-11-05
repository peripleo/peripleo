import React from 'react';
import { Size, useDeviceState } from '../device';

export const Desktop = (props: { children: React.ReactElement }) => {

  const device = useDeviceState();

  return device.size === Size.DESKTOP ? props.children : null;

}