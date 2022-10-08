import createGraph, { Graph } from 'ngraph.graph';
import Fuse from 'fuse.js';
import RBush from 'rbush';
import { Graph as IGraph, Node, Edge, Bounds, Feature } from './GraphTypes'; 
import { normalizeURI, getBounds } from './utils';

type IndexedNode = Bounds & { node: Node }

export class BrowserGraph implements IGraph {

  graph: Graph<Node, Edge>

  spatialIndex: RBush<IndexedNode>;

  fulltextIndex: Fuse<Node>;

  constructor(index: string[] = []) {
    this.graph = createGraph();

    this.spatialIndex = new RBush();

    this.fulltextIndex = new Fuse<Node>([], {
      includeScore: true,
      threshold: 0.2,
      keys: index || ['properties.title']
    });
  }

  init = (nodes: Node[], edges: Edge[]) => {
    this.graph.clear();
    this.spatialIndex.clear();

    nodes.forEach(this.addNode);
    edges.forEach(this.addEdge);
  }

  addNode = (n: Node) => {
    try {
      const id = normalizeURI(n.id);
      const node: Node = { ...n, id };

      this.graph.addNode(id, node);

      const bounds = getBounds(node as Feature);
      if (bounds)
        this.spatialIndex.insert({ ...bounds, node });

      this.fulltextIndex.add(node);
    } catch (error) {
      console.error('Error adding node to store', n);
    } 
  }

  addEdge = (e: Edge) => {
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

  getNodeById = (id: string) =>
    this.graph.getNode(normalizeURI(id))?.data;

  getConnectedSync = (id: string): Node[] => {
    const linkedNodes: Node[] = [];

    this.graph.forEachLinkedNode(id, (node, edge) => {
      if (node.data)
        linkedNodes.push(node.data);
    }, false);

    return linkedNodes;
  }

  getConnected = (id: string): Promise<Node[]> =>
    new Promise(resolve => resolve(this.getConnectedSync(id)));

  getColocatedRecursive = (node: Node, maxHops = Number.MAX_VALUE, spentHops = 0, aggregated: Node[] = []): Node[] => {
    if (spentHops >= maxHops)
      return [];

    // All direct neighbors to this node without geometry
    const unlocatedNeighbours = this.getConnectedSync(node.id)
      .filter(node => !node.geometry)
      .filter(node => !aggregated.includes(node));

    // Add all direct neighbors to the neighbourhood
    const unlocatedNeighbourhood = [ ...aggregated, ...unlocatedNeighbours];

    // Traverse further for each direct unlocated neighbour
    if (unlocatedNeighbours.length > 0) {
      return unlocatedNeighbours.reduce((agg, node) =>
        this.getColocatedRecursive(node, maxHops, spentHops + 1, agg), unlocatedNeighbourhood);
    } else {
      // Done
      return unlocatedNeighbourhood;
    }
  }
  
  getNodesInBounds = (bounds: number[]): Node[] => {
    const [ minX, minY, maxX, maxY ] = bounds;
    
    const results = this.spatialIndex.search({ minX, minY, maxX, maxY });

    // We'll exclude nodes that are larger than the viewport!
    const isInsideBounds = (n: IndexedNode) =>
      n.minX > minX && n.maxX < maxX && n.minY > minY && n.maxY < maxY;

    return results
      .filter(isInsideBounds)
      .map(result => result.node);
  }
  
  getAllFeatures = (): Feature[] => {
    const allLocated = this.getNodesInBounds([-180,-90,180,90]);

    const withUnlocatedNeighbourhood = allLocated.map(node => {
      const neighbours = this.getColocatedRecursive(node);

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
        },
        geometry: node.geometry
      }
    });

    return withUnlocatedNeighbourhood;
  }

}