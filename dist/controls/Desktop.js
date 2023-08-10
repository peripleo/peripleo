import { Size, useDeviceState } from '../device';
export const Desktop = (props) => {
    const device = useDeviceState();
    return device.size === Size.DESKTOP ? props.children : null;
};
//# sourceMappingURL=Desktop.js.map