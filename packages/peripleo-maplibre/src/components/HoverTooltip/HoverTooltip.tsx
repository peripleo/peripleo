import { ReactNode, useCallback, useEffect, useMemo } from 'react';
import { Feature } from '@peripleo/peripleo';
import { HoverState, useHoverValue } from '../../hooks';
import type { Placement } from '@floating-ui/react';
import {
  useFloating,
  shift,
  autoUpdate,
  flip,
  offset
} from '@floating-ui/react';

import './HoverTooltip.css';

interface HoverTooltipProps <T extends Feature> {

  placement?: Placement;

  layerId?: string | string[];

  tooltip: (state: HoverState<T>) => ReactNode;

}

export const HoverTooltip = <T extends Feature>(props: HoverTooltipProps<T>) => {

  const hover = useHoverValue<T>();

  const filtered = useMemo(() => {
    if (!hover?.mapFeature || !props.layerId) return hover;

    const layers = Array.isArray(props.layerId) ? props.layerId : [props.layerId];
    const isValidLayer = layers.includes(hover.mapFeature.layer.id);

    return isValidLayer && hover;
  }, [hover, props.layerId]);

  const isOpen = Boolean(filtered?.mapEvent?.originalEvent);

  const placement = props.placement || 'bottom-start';

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    placement,
    middleware: [
      offset(10),
      flip({ crossAxis: true }),
      shift({ 
        crossAxis: true,
        padding: { right: 5, left: 5, top: 10, bottom: 10 }
      })
    ],
    whileElementsMounted: autoUpdate
  });

  const handlePointerMove = useCallback((evt: PointerEvent) => {
    const x = evt.clientX;
    const y = evt.clientY;
    
    refs.setPositionReference({
      getBoundingClientRect() {
        return {
          width: 0,
          height: 0,
          x,
          y,
          top: y,
          left: x,
          right: x,
          bottom: y
        };
      },
    });
  }, [refs]);

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [handlePointerMove]);

  return filtered?.mapEvent?.originalEvent && (
    <div
      ref={refs.setFloating}
      style={floatingStyles}
      className="p6o-hover-tooltip">
      {props.tooltip(hover)}
    </div>
  )

}