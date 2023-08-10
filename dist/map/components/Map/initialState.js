import { WebMercatorViewport } from '@deck.gl/core/typed';
export const getDefaultViewState = (initialBounds, el) => {
    const { offsetWidth, offsetHeight } = el;
    const viewport = new WebMercatorViewport({
        width: offsetWidth,
        height: offsetHeight
    });
    return viewport.fitBounds(initialBounds, {});
};
//# sourceMappingURL=initialState.js.map