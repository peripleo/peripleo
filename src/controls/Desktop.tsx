import React from 'react';
import { Device, useDeviceState } from '../device';

export const Desktop = (props: { children: React.ReactElement }) => {

  const device = useDeviceState();

  return device === Device.DESKTOP ? props.children : null;

}