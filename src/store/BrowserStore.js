import centroid from '@turf/centroid';
import createGraph from 'ngraph.graph';
import Fuse from 'fuse.js';
import knn from 'rbush-knn';
import RBush from 'rbush';

import { normalizeURI, getBounds } from './Utils';

export class BrowserStore {

  constructor(index) {
    this.graph = createGraph();

    this.spatialIndex = new RBush();

    this.fulltextIndex = new Fuse([], {
      includeScore: true,
      threshold: 0.2,
      keys: index || ['properties.title']
    });
  }

  init = (nodes, edges) => {
    this.graph.clear();
    this.spatialIndex.clear();

    nodes.forEach(this.addNode);
    edges.forEach(this.addEdge);
  }

  addNode = n => {
    try {
      const id = normalizeURI(n.id);
      const node = { ...n, id };

      this.graph.addNode(id, node);

      const bounds = getBounds(node);
      if (bounds)
        this.spatialIndex.insert({ ...bounds, node });

      this.fulltextIndex.add(node);
    } catch (error) {
      console.error('Error adding node to store', n);
    } 
  }

  addEdge = e => {
    const source = normalizeURI(e.source);
    const target = normalizeURI(e.target)
    const edge = { ...e, source, target };
    this.graph.addLink(source, target, edge);
  }

  countNodes = () => {
    let nodes = 0;
    this.graph.forEachNode(() => { nodes = nodes + 1; });
    return nodes;
  }

  countEdges = () => {
    let edges = 0;
    this.graph.forEachLink(() => { edges += 1; });
    return edges;
  }

  getNode = id =>
    this.graph.getNode(normalizeURI(id))?.data;

  /** 
   * Return nodes in the graph connected to the
   * node with the given ID. Returns only 'known' nodes, 
   * where `data` is defined!
   */
  getConnectedNodes = id => {
    const linkedNodes = [];

    this.graph.forEachLinkedNode(id, (node, link) => {
      if (node.data)
        linkedNodes.push({ node, link });
    });

    return linkedNodes.map(t => t.node.data);
  }

  /** 
   * Return 'link nodes' in the graph for this node.
   * Links are graph nodes with no `data` defined.
   */
  getExternalLinks = id => {
    const linkedNodes = [];

    this.graph.forEachLinkedNode(id, (node, link) => {
      if (!node.data)
        linkedNodes.push({ node, link });
    });

    return linkedNodes.map(t => t.link.data);
  }

  getNearestNeighbours = (feature, n, search) => {
    const [x, y] = centroid(feature)?.geometry.coordinates;

    let neighbours = null;

    // TODO what would be a less hacky way to do this?
    if (search.query) {
      const allIndexed = new RBush();
      search.items.forEach(node => {
        const bounds = getBounds(node);
        allIndexed.insert({ ...bounds, node });  
      });

      neighbours = knn(allIndexed, x, y, n + 1);
    } else {
      neighbours = knn(this.spatialIndex, x, y, n + 1);
    }

    // Neighbours will include the feature itself, but we can't be sure
    // about the order (locations might be identical!)
    const featureId = feature.id || feature.identifier;

    return neighbours.map(n => n.node).filter(node => { 
      const id = node.id || node.identifier;
      return id !== featureId;
    });
  }

  getNodesInBounds = (bounds, optDataset) => {
    let minX, minY, maxX, maxY;

    if (bounds.length === 4)
      [ minX, minY, maxX, maxY ] = bounds;
    else
      [[ minX, minY ], [ maxX, maxY ]] = bounds;
    
    const results = this.spatialIndex.search({ minX, minY, maxX, maxY });

    const filtered = optDataset ?
      results.filter(r => r.node.dataset === optDataset) : results;

    // We'll exclude nodes that are larger than the viewport!
    const isInsideBounds = r =>
      r.minX > minX && r.maxX < maxX && r.minY > minY && r.maxY < maxY;

    return filtered
      .filter(result =>
        result.node.geometry.type === 'Point' || isInsideBounds(result))
      .map(result => result.node);
  }

  getAllLocatedNodes = () => new Promise(resolve => {
    const allLocated = this.getNodesInBounds([-180,-90,180,90]);

    const withUnlocatedNeighbourhood = allLocated.map(node => {
      const neighbours = this.fetchLinkedRecursive(node);

      // To support hybrid scenarios: each node may have a 'count' prop that
      // defines how many search results it represents
      const count = (node.properties.count || 1) +
        neighbours.reduce((total, n) => total + (n.properties?.count || 1), 0);

      return {
        ...node,
        properties: {
          ...node.properties,
          count,
          merged_records: neighbours.length
        }
      }
    });

    resolve(withUnlocatedNeighbourhood);
  });
    
  fetchGeometryRecursive = (node, maxHops, spentHops = 0) => {
    if (spentHops >= maxHops)
      return;
    
    // Don't walk graph unnecessarily
    if (node.geometry)
      return node.geometry;

    // Get all neighbors
    const neighbors = this.getConnectedNodes(node.id);

    // Find first neighbour with a geometry
    const locatedNeighbour = neighbors.find(node => node.geometry);

    if (locatedNeighbour) {
      return locatedNeighbour.geometry;
    } else if (neighbors.length > 0) {
      const nextHops = neighbors.map(node => 
        this.fetchGeometryRecursive(node, maxHops, spentHops + 1));

      return nextHops.find(geom => geom);
    }
  }

  fetchLinkedRecursive = (node, maxHops = Number.MAX_VALUE, spentHops = 0, aggregated = []) => {
    if (spentHops >= maxHops)
      return;

    // All direct neighbors to this node without geometry
    const directUnlocatedNeighbors = this.getConnectedNodes(node.id)
      .filter(node => !node.geometry)
      .filter(node => !aggregated.includes(node));

    // Add all direct neighbors to the neighbourhood
    const unlocatedNeighbourhood = [ ...aggregated, ...directUnlocatedNeighbors];

    // Traverse further for each direct unlocated neighbour
    if (directUnlocatedNeighbors.length > 0) {
      return directUnlocatedNeighbors.reduce((agg, node) =>
        this.fetchLinkedRecursive(node, maxHops, spentHops + 1, agg), unlocatedNeighbourhood);
    } else {
      // Done
      return unlocatedNeighbourhood;
    }
  }

  searchMappable = query => new Promise(resolve => {
    const response = this.fulltextIndex.search(query, { limit: 100000 });
    const items = response.map(r => this.getNode(r.item.id));
    
    const mappable = items.map(node => node.geometry?.type ?
      node : { ...node, geometry: this.fetchGeometryRecursive(node, 2) }
    ).filter(n => n.geometry?.type);

    resolve(mappable);
  });

}