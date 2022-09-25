import React from 'react';

// TODO make this dynamic!
const OFFSET = [15, 15];

const TooltipContainer = props => {

  const {x, y, node, feature, tooltip} = props;
  
  const left = x + OFFSET[0];
  const top = y + OFFSET[1];

  return (
    <div 
      className="p6o-map-tooltip-container"
      style={{left, top}}>

      {tooltip({node, feature})}
    </div>
  );

}

export default TooltipContainer;
