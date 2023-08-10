/// <reference types="react" />
import { MapRef } from 'react-map-gl';
import { MapSelection, ViewState } from '../types';
import './PopupContainer.css';
declare type PopupContainerProps = {
    selected: MapSelection;
    viewState: ViewState;
    map: MapRef;
    popup: Function;
    onClose: Function;
};
export declare const PopupContainer: (props: PopupContainerProps) => JSX.Element;
export {};
//# sourceMappingURL=PopupContainer.d.ts.map