import { WebMercatorViewport } from '@deck.gl/core/typed';
import { ViewState } from '../../types';

export const getDefaultViewState = (initialBounds: [[number, number], [number, number]], el: HTMLDivElement) => {
  const { offsetWidth, offsetHeight } = el;

  const viewport = new WebMercatorViewport({
    width: offsetWidth,
    height: offsetHeight
  });

  return viewport.fitBounds(initialBounds, {});
}