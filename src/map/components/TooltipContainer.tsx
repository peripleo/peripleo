import React, { useMemo, useRef } from 'react';
import { useAutoPosition } from './useAutoPosition';

type TooltipContainerProps = {

  x: number
  
  y: number
  
  node: any

  feature: any

  tooltip: Function

}

export const TooltipContainer = (props: TooltipContainerProps) => {

  const el = useRef<HTMLDivElement>(null);

  const { x, y, node, feature, tooltip } = props;

  const { left, top } = useAutoPosition(el, x, y);

  const renderedTooltip = useMemo(() => 
    node ? tooltip({ node, feature }) : null, [ node, feature ]);

  return renderedTooltip && (
    <div 
      ref={el}
      className="p6o-map-tooltip-container"
      style={{left, top, zIndex: 1 }}>
      {renderedTooltip}
    </div>
  );

}