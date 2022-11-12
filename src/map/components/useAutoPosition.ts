import React, { useEffect, useState } from 'react';

export const useAutoPosition = (
  ref: React.RefObject<Element>, 
  x: number, 
  y: number, 
  offset: [number, number] = [15, 15]
) => {

  const [ left, setLeft ] = useState(x); // + offset[0]);

  const [ top, setTop ] = useState(y); // + offset[1]);

  useEffect(() => setLeft(x), [ x ]);

  useEffect(() => setTop(y), [ y ]);

  useEffect(() => {
    if (ref.current) {
      const elemBounds = 
        (ref.current.firstChild as Element)?.getBoundingClientRect();
        
      const mapBounds =
        ref.current.closest('.p6o-map-container')?.getBoundingClientRect();

      if (elemBounds && mapBounds) {
        const exceedsRight = elemBounds.right > mapBounds.right;
        const exceedsBottom = elemBounds.bottom > mapBounds.bottom;

        if (exceedsRight) {
          setLeft(mapBounds.right - elemBounds.width - offset[0]);
        }

        if (exceedsBottom) {
          setTop(mapBounds.bottom - elemBounds.height - offset[1]);
        }
      }
    }
  }, [ ref.current?.getBoundingClientRect() ]);

  return { top, left };

}