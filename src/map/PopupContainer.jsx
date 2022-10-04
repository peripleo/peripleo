import React, { useEffect, useState } from 'react';
import centroid from '@turf/centroid';

const PopupContainer = props => {

  const { selected, viewState, map, popup} = props;

  const [offset, setOffset] = useState();
  
  useEffect(() => {
    if (selected) {
      const lonlat = centroid(selected.feature)?.geometry.coordinates;
      const {x, y} = map.project(lonlat);
      setOffset({ left: x, top: y });
    }
  }, [selected, viewState]);

  return selected && (
    <div 
      className="p6o-map-popup-container"
      style={{ position: 'absolute', ...offset }}>

      {popup(props)}

    </div>
  );

}

export default PopupContainer;