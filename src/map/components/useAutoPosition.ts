import React, { useEffect, useState } from 'react';

export const useAutoPosition = (
  ref: React.RefObject<Element>, 
  x: number, 
  y: number, 
  padding: [number, number, number, number] = [15, 0, 0, 15]
) => {

  const [ left, setLeft ] = useState(x + padding[3]);

  const [ top, setTop ] = useState(y + padding[0]);

  useEffect(() => setLeft(x), [ x ]);

  useEffect(() => setTop(y), [ y ]);

  useEffect(() => {
    if (ref.current) {
      const elemBounds = 
        (ref.current.firstChild as Element)?.getBoundingClientRect();
        
      const mapBounds =
        ref.current.closest('.p6o-map-container')?.getBoundingClientRect();

      if (elemBounds && mapBounds) {
        const exceedsRight = elemBounds.right + padding[1] > mapBounds.right;
        const exceedsBottom = elemBounds.bottom + padding[2] > mapBounds.bottom;

        if (exceedsRight) {
          setLeft(mapBounds.right - elemBounds.width - padding[1] - padding[3]);
        }

        if (exceedsBottom) {
          setTop(mapBounds.bottom - elemBounds.height - padding[0] - padding[2]);
        }
      }
    }
  }, [ ref.current?.getBoundingClientRect() ]);

  return { top, left };

}