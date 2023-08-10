import { useMap as useOneOfManyMaps } from 'react-map-gl';
// react-map-gl has a utility hook that supports
// multiple child maps, and one parent map. We want
// a simplified hook which assumes only a single
// map inside the Peripleo tag.
export const useMap = () => {
    const { current, ...maps } = useOneOfManyMaps();
    return Object.values(maps)[0];
};
//# sourceMappingURL=useMap.js.map