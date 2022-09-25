import React, { useEffect, useRef, useState } from 'react';

// TODO make this dynamic!
const OFFSET = [15, 15];

const TooltipContainer = props => {

  const el = useRef();

  const {x, y, node, feature, tooltip} = props;
  
  const [left, setLeft] = useState(x + OFFSET[0]);
  const [top, setTop] = useState(y + OFFSET[1]);

  useEffect(() => {
    if (el.current) {
      const elemBounds = 
        el.current.firstChild.getBoundingClientRect();
        
      const mapBounds =
        el.current.closest('.p6o-map-container')
          .getBoundingClientRect();

      const exceedsRight = elemBounds.right > mapBounds.right;
      const exceedsBottom = elemBounds.bottom > mapBounds.bottom;

      if (exceedsRight) 
        setLeft(mapBounds.right - elemBounds.width - OFFSET[0]);

      if (exceedsBottom)
        setTop(mapBounds.bottom - elemBounds.height - OFFSET[1]);
    }
  }, [el.current?.getBoundingClientRect()]);

  return (
    <div 
      ref={el}
      className="p6o-map-tooltip-container"
      style={{left, top}}>

      {tooltip({node, feature})}
    </div>
  );

}

export default TooltipContainer;
