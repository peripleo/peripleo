import React from 'react';
import { Size, useDeviceState } from '../device';

export const Mobile = (props: { children: React.ReactElement }) => {

  const device = useDeviceState();

  return device.size === Size.MOBILE ? props.children : null;

}