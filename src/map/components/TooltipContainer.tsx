import React, { useEffect, useMemo, useRef, useState } from 'react';

const OFFSET = [15, 15];

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

  const [ left, setLeft ] = useState(x + OFFSET[0]);
  const [ top, setTop ] = useState(y + OFFSET[1]);

  const renderedTooltip = useMemo(() => 
    node ? tooltip({ node, feature }) : null, [ node, feature ]);

  useEffect(() => {
    if (el.current) {
      const elemBounds = 
        (el.current.firstChild as Element)?.getBoundingClientRect();
        
      const mapBounds =
        el.current.closest('.p6o-map-container')?.getBoundingClientRect();

      if (elemBounds && mapBounds) {
        const exceedsRight = elemBounds.right > mapBounds.right;
        const exceedsBottom = elemBounds.bottom > mapBounds.bottom;

        if (exceedsRight) 
          setLeft(mapBounds.right - elemBounds.width - OFFSET[0]);

        if (exceedsBottom)
          setTop(mapBounds.bottom - elemBounds.height - OFFSET[1]);
      }
    }
  }, [el.current?.getBoundingClientRect()]);

  return renderedTooltip && (
    <div 
      ref={el}
      className="p6o-map-tooltip-container"
      style={{left, top, zIndex: 1 }}>
      {renderedTooltip}
    </div>
  );

}