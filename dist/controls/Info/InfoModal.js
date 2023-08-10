import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { IoCloseOutline } from 'react-icons/io5';
import { Size, useDeviceState } from '../../device';
export const InfoModal = (props) => {
    const el = useRef(null);
    const device = useDeviceState();
    useEffect(() => {
        const onKeyDown = (evt) => {
            if (evt.key === 'Escape')
                props.onClose(null);
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, []);
    const onClick = (evt) => {
        if (evt.target === el.current)
            props.onClose(evt);
    };
    return ReactDOM.createPortal(React.createElement("div", { ref: el, className: props.className ? `p6o-info-modal-bg ${props.className}` : 'p6o-info-modal-bg', onClick: onClick },
        React.createElement("button", { className: device.size === Size.DESKTOP ? 'p6o-info-modal-close' : 'p6o-info-modal-close mobile', onClick: props.onClose },
            React.createElement(IoCloseOutline, null)),
        React.createElement("main", { className: "p6o-info-modal-main" }, props.children)), document.body);
};
//# sourceMappingURL=InfoModal.js.map