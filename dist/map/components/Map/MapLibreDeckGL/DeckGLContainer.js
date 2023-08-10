import React, { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useRecoilState } from 'recoil';
import { mapViewState, isValidViewState } from '../../../state';
import { DeckGLMap } from './DeckGLMap';
import { getDefaultViewState } from '../initialState';
export const DeckGLContainer = (props) => {
    const ref = useRef(null);
    // Application-wide Recoil viewState 
    const [globalViewState, setGlobalState] = useRecoilState(mapViewState);
    // initialViewState passed into DeckGl
    const [initialViewState, setInitialViewState] = useState(isValidViewState(globalViewState) ? globalViewState : null);
    // DeckGL's current viewState
    const [currentViewState, setCurrentViewState] = useState();
    // DeckGL's current viewState, debounced
    const [debouncedViewState] = useDebounce(currentViewState, 200);
    // Sync debounced state upwards, to global app state
    useEffect(() => {
        if (debouncedViewState)
            setGlobalState(debouncedViewState);
    }, [debouncedViewState]);
    // Set initial view state on first render
    useEffect(() => {
        if (ref.current && !initialViewState) {
            const defaultState = getDefaultViewState(props.defaultBounds, ref.current);
            setInitialViewState(defaultState);
        }
    }, [ref.current]);
    // When global viewState changes from the outside (e.g.
    // because the Zoom component modifies it), update
    // the initialViewState, so that DeckGL syncs the map.
    useEffect(() => {
        if (ref.current) {
            if (initialViewState && isValidViewState(globalViewState)) {
                setInitialViewState(globalViewState);
            }
        }
    }, [globalViewState]);
    return (React.createElement("div", { ref: ref, className: 'p6o-map-container' }, initialViewState &&
        React.createElement(DeckGLMap, { ...props, initialViewState: initialViewState, onViewStateChange: (e) => setCurrentViewState(e.viewState) })));
};
//# sourceMappingURL=DeckGLContainer.js.map