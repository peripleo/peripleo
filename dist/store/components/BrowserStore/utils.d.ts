import { Bounds, Feature } from '../../types';
/**
 * Because this is frequently mixed up in user data:
 * normalize all URIs to http rathern than https.
 */
export declare const normalizeURI: (uri: string) => string;
/**
 * Compute the bounds of this node, if it has a
 * geometry.
 */
export declare const getBounds: (feature: Feature) => Bounds | undefined;
//# sourceMappingURL=utils.d.ts.map