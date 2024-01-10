import { TypeSenseSearchResult } from './TypeSenseSearchResult';

/**
 * Necessary normalization steps to make the TypeSense result work 
 * for visualization. Currently, these include:
 * 
 * - Removing places without coordinates
 */
export const normalizeResults = (results: TypeSenseSearchResult[]) =>
  results.filter(h => h.coordinates)
