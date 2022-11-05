import React from 'react';
import { Device, useDeviceState } from '../device';

export const Mobile = (props: { children: React.ReactElement }) => {

  const device = useDeviceState();

  return device === Device.MOBILE ? props.children : null;

}