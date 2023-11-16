import type { Map } from 'maplibre-gl';

const PADDING = 40;

export const moveIntoView = (map: Map, bounds: DOMRect) => {    
  const mapBounds = map.getCanvasContainer().querySelector('canvas').getBoundingClientRect();

  let dx = 0;
  let dy = 0;

  if (bounds.left - PADDING < mapBounds.left) {
    dx = bounds.left - mapBounds.left - PADDING;
  } else if (bounds.right + PADDING > mapBounds.right) {
    dx = bounds.right - mapBounds.right + PADDING;
  }

  if (bounds.top - PADDING < mapBounds.top) {
    dy = bounds.top - mapBounds.top - PADDING;
  } else if (bounds.bottom + PADDING > mapBounds.bottom) {
    dy = bounds.bottom + PADDING - mapBounds.bottom;
  }

  if (dx !== 0 || dy !== 0)
    map.panBy([dx, dy]);
}