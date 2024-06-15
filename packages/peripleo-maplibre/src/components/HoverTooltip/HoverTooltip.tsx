import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Feature } from '@peripleo/peripleo';
import { HoverState, useHoverValue } from '@peripleo/maplibre';

import './HoverTooltip.css';

interface HoverTooltipProps <T extends Feature>{

  layerId?: string | string[];

  tooltip: (state: HoverState<T>) => ReactNode;

}

export const HoverTooltip = <T extends Feature>(props: HoverTooltipProps<T>) => {

  const ref = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState<{ top: number, left: number } | undefined>();

  const hover = useHoverValue<T>();

  const filtered = useMemo(() => {
    if (!hover?.mapFeature || !props.layerId) return hover;

    const layers = Array.isArray(props.layerId) ? props.layerId : [props.layerId];
    const isValidLayer = layers.includes(hover.mapFeature.layer.id);

    return isValidLayer && hover;
  }, [hover, props.layerId]);

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

  return filtered?.mapEvent?.originalEvent && (
    <div
      ref={ref}
      className="p6o-hover-tooltip"
      style={position}>
      {props.tooltip(hover)}
    </div>
  )

}