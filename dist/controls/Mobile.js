import { Size, useDeviceState } from '../device';
export const Mobile = (props) => {
    const device = useDeviceState();
    return device.size === Size.MOBILE ? props.children : null;
};
//# sourceMappingURL=Mobile.js.map