import React, { useEffect, useMemo, useRef, useState } from 'react';
import centroid from '@turf/centroid';
import { IoCloseOutline } from 'react-icons/io5';
import { Size, useDeviceState } from '../../device';
import './PopupContainer.css';
import { useAutoPosition } from './useAutoPosition';
export const PopupContainer = (props) => {
    const device = useDeviceState();
    const el = useRef(null);
    const { selected, viewState, map, popup } = props;
    const [offset, setOffset] = useState({ left: 0, top: 0 });
    const { top, left } = device.size === Size.DESKTOP ?
        useAutoPosition(el, offset.left, offset.top) : { top: 0, left: 0 };
    useEffect(() => {
        if (selected && device.size === Size.DESKTOP) {
            const lonlat = centroid(selected.feature)?.geometry.coordinates;
            const { x, y } = map.project(lonlat);
            setOffset({ left: x, top: y });
        }
        else if (selected) {
            setOffset({ left: 0, top: 0 });
        }
    }, [selected, viewState, device.size]);
    const renderedPopup = useMemo(() => selected ? popup({ ...props, onClose: props.onClose }) : null, [selected]);
    return renderedPopup && (React.createElement("div", { className: device.size === Size.DESKTOP ? "p6o-map-popup-container" : "p6o-map-popup-container-mobile", style: { zIndex: 9, position: 'absolute', top, left } },
        React.createElement("button", { className: "p6o-map-popup-close", 
            /* @ts-ignore */
            onClick: props.onClose },
            React.createElement(IoCloseOutline, null)),
        React.createElement("main", { ref: el }, renderedPopup)));
};
//# sourceMappingURL=PopupContainer.js.map