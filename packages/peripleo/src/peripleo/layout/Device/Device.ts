import { useDeviceState } from './DeviceStateProvider';
import { Size } from './Types';

const Desktop = (props: { children: React.ReactElement }) => {

  const device = useDeviceState();

  return device.size === Size.DESKTOP ? props.children : null;

}

const Mobile = (props: { children: React.ReactElement }) => {

  const device = useDeviceState();

  return device.size === Size.MOBILE ? props.children : null;

}

export const Device = { Desktop, Mobile }