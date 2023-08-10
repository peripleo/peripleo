import bbox from '@turf/bbox';
/**
 * Because this is frequently mixed up in user data:
 * normalize all URIs to http rathern than https.
 */
export const normalizeURI = (uri) => uri.replace('https://', 'http://');
/**
 * Compute the bounds of this node, if it has a
 * geometry.
 */
export const getBounds = (feature) => {
    if (feature.geometry) {
        if (feature.geometry.type === 'Point') {
            const [x, y] = feature.geometry.coordinates;
            return { minX: x, minY: y, maxX: x, maxY: y };
        }
        else {
            const [minX, minY, maxX, maxY] = bbox(feature);
            return { minX, minY, maxX, maxY };
        }
    }
};
//# sourceMappingURL=utils.js.map