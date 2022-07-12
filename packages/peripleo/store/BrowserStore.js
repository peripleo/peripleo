import createGraph from 'ngraph.graph';
import RBush from 'rbush';
import knn from 'rbush-knn';
import centroid from '@turf/centroid';

import { normalizeURI, getBounds } from './Utils';

export class BrowserStore {

  constructor() {
    this.graph = createGraph();
    this.spatialIndex = new RBush();

    // TODO Fuse.JS search index

  }

  init = (nodes, edges) => {
    this.graph.clear();
    this.spatialIndex.clear();

    nodes.forEach(this.addNode);
    edges.forEach(this.addEdge);
  }

  addNode = node => {
    this.graph.addNode(normalizeURI(node.id), node);

    const bounds = getBounds(node);
    if (bounds)
      this.spatialIndex.insert({ ...bounds, node });
  }

  addEdge = edge => {
    this.graph.addLink(normalizeURI(edge.source), normalizeURI(edge.target), edge);
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

  getAllLocatedNodes = () =>
    this.getNodesInBounds([-180,-90,180,90]);
    
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
        this.fetchUpstreamGeometry(node, maxHops, spentHops + 1));

      return nextHops.find(geom => geom);
    }
  }

  suggest = query => {
    const response = this.searchIndex.search(query, { limit: 5 });
    
    // Collapse FlexSearch results
    const results = response.reduce((ids, r) =>
      [...ids, ...r.result], []);

    const hits = new Set(results.map(id => this.getNode(id)));
    return getSuggestedTerms(query, Array.from(hits));
  }

  searchMappable = query => {
    // FlexSearch result format is horrible and creates duplicates!
    const response = this.searchIndex.search(query, { limit: 100000 });

    const results = Array.from(
      // Remove duplicates
      response.reduce((ids, r) =>
        new Set([...ids, ...r.result]), new Set())
      
      // Resolve IDs
    ).map(id => this.getNode(id));
    
    const withInferredGeometry = results
      .map(node => {
        if (node.geometry?.type) {
          return node;
        } else {
          // Unlocated node - try to fetch location from the graph
          return { ...node, geometry: this.fetchGeometryRecursive(node, 2) };
        }
      })
    .filter(n => n.geometry?.type);

    return withInferredGeometry;
  }

}