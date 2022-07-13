import bbox from '@turf/bbox';

/** 
 * Because this is frequently mixed up in user data: 
 * normalize all URIs to http rathern than https.
 */
export const normalizeURI = uri => 
  uri.replace('https://', 'http://');

/**
 * Compute the bounds of this node, if it has a 
 * geometry.
 */
export const getBounds = node => {
  if (node.geometry) {
    if (node.geometry.type === 'Point') {
      const [x, y] = node.geometry.coordinates;
      return {minX: x, minY: y, maxX: x, maxY: y};
    } else {
      try {
        const [minX, minY, maxX, maxY] = bbox(node);
        return {minX, minY, maxX, maxY};
      } catch {
        console.error('Error parsing geometry for node', node);
      }
    }
  }
}

export const nodeToDocument = node => ({
  id: node.id,
  title: node.title
});
