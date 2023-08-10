import React from 'react';
import { useRecoilState } from 'recoil';
import { mapViewState } from '../../map';
import { useMap } from '../../map';
import { FiPlus, FiMinus } from 'react-icons/fi';
import './ZoomControl.css';
export const ZoomControl = () => {
    const map = useMap();
    const [viewState, setViewState] = useRecoilState(mapViewState);
    const onZoom = (inc) => () => {
        if (map)
            setViewState({
                ...viewState,
                zoom: viewState.zoom + inc,
                transitionDuration: 200
            });
        map?.easeTo({ zoom: map.getZoom() + inc });
    };
    return (React.createElement("div", { className: "p6o-zoom-container" },
        React.createElement("button", { className: "p6o-controls-btn p6o-zoom p6o-zoom-in", tabIndex: 31, "aria-label": "Zoom in", onClick: onZoom(1) },
            React.createElement(FiPlus, null)),
        React.createElement("button", { className: "p6o-controls-btn p6o-zoom p6o-zoom-out", tabIndex: 32, "aria-label": "Zoom out", onClick: onZoom(-1) },
            React.createElement(FiMinus, null))));
};
//# sourceMappingURL=ZoomControl.js.map