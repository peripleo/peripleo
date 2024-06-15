import { ReactNode, useEffect, useRef, useState } from 'react';
import { Feature } from '@peripleo/peripleo';
import { HoverState, useHoverValue } from '@peripleo/maplibre';

import './HoverTooltip.css';

interface HoverTooltipProps <T extends Feature>{

  tooltip: (state: HoverState<T>) => ReactNode;

}

export const HoverTooltip = <T extends Feature>(props: HoverTooltipProps<T>) => {

  const ref = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState<{ top: number, left: number } | undefined>();

  const hover = useHoverValue<T>();

  useEffect(() => {
    const onPointerMove = (evt: PointerEvent) => {
      const left = evt.clientX;
      const top = evt.clientY;
      setPosition({ left, top });
    }

    window.addEventListener('pointermove', onPointerMove);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
    }
  }, []);

  return hover?.mapEvent?.originalEvent && (
    <div
      ref={ref}
      className="p6o-hover-tooltip"
      style={position}>
      {props.tooltip(hover)}
    </div>
  )

}