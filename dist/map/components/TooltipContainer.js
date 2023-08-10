import React, { useMemo, useRef } from 'react';
import { useAutoPosition } from './useAutoPosition';
export const TooltipContainer = (props) => {
    const el = useRef(null);
    const { x, y, node, feature, tooltip } = props;
    const { left, top } = useAutoPosition(el, x, y);
    const renderedTooltip = useMemo(() => node ? tooltip({ node, feature }) : null, [node, feature]);
    return renderedTooltip && (React.createElement("div", { ref: el, className: "p6o-map-tooltip-container", style: { left, top, zIndex: 1 } }, renderedTooltip));
};
//# sourceMappingURL=TooltipContainer.js.map