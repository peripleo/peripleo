import createGraph from 'ngraph.graph';
import Fuse from 'fuse.js';
import RBush from 'rbush';
import { normalizeURI, getBounds } from './utils';
export class BrowserGraph {
    graph;
    spatialIndex;
    fulltextIndex;
    constructor(index = []) {
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
    };
    addNode = (n) => {
        try {
            const id = normalizeURI(n.id);
            const node = { ...n, id };
            this.graph.addNode(id, node);
            const bounds = getBounds(node);
            if (bounds)
                this.spatialIndex.insert({ ...bounds, node });
            this.fulltextIndex.add(node);
        }
        catch (error) {
            console.error('Error adding node to store', n);
        }
    };
    addEdge = (e) => {
        const source = normalizeURI(e.source);
        const target = normalizeURI(e.target);
        const edge = { ...e, source, target };
        this.graph.addLink(source, target, edge);
    };
    countNodes = () => {
        let nodes = 0;
        this.graph.forEachNode(() => { nodes = nodes + 1; });
        return nodes;
    };
    countEdges = () => {
        let edges = 0;
        this.graph.forEachLink(() => { edges += 1; });
        return edges;
    };
    getNodeById = (id) => this.graph.getNode(normalizeURI(id))?.data;
    getConnectedSync = (id) => {
        const linkedNodes = [];
        this.graph.forEachLinkedNode(id, (node, edge) => {
            if (node.data)
                linkedNodes.push(node.data);
        }, false);
        return linkedNodes;
    };
    getConnected = (id) => new Promise(resolve => resolve(this.getConnectedSync(id)));
    getColocatedRecursive = (node, maxHops = Number.MAX_VALUE, spentHops = 0, aggregated = []) => {
        if (spentHops >= maxHops)
            return [];
        // All direct neighbors to this node without geometry
        const unlocatedNeighbours = this.getConnectedSync(node.id)
            .filter(node => !node.geometry)
            .filter(node => !aggregated.includes(node));
        // Add all direct neighbors to the neighbourhood
        const unlocatedNeighbourhood = [...aggregated, ...unlocatedNeighbours];
        // Traverse further for each direct unlocated neighbour
        if (unlocatedNeighbours.length > 0) {
            return unlocatedNeighbours.reduce((agg, node) => this.getColocatedRecursive(node, maxHops, spentHops + 1, agg), unlocatedNeighbourhood);
        }
        else {
            // Done
            return unlocatedNeighbourhood;
        }
    };
    getNodesInBounds = (bounds) => {
        const [minX, minY, maxX, maxY] = bounds;
        const results = this.spatialIndex.search({ minX, minY, maxX, maxY });
        // We'll exclude nodes that are larger than the viewport!
        const isInsideBounds = (n) => n.minX > minX && n.maxX < maxX && n.minY > minY && n.maxY < maxY;
        return results
            .filter(isInsideBounds)
            .map(result => result.node);
    };
    getAllFeatures = () => {
        const allLocated = this.getNodesInBounds([-180, -90, 180, 90]);
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
            };
        });
        return withUnlocatedNeighbourhood;
    };
    search = (query) => this.fulltextIndex.search(query).map((result) => result.item);
}
//# sourceMappingURL=browserGraph.js.map