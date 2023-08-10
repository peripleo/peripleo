import { atom } from 'recoil';
export const mapViewState = atom({
    key: 'mapView',
    default: {}
});
export const isValidViewState = (viewState) => {
    const { longitude, latitude, zoom } = viewState;
    const def = x => x !== undefined;
    return def(longitude) && def(latitude) && def(zoom);
};
//# sourceMappingURL=mapViewState.js.map