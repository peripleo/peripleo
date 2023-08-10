import { Graph } from 'ngraph.graph';
import Fuse from 'fuse.js';
import RBush from 'rbush';
import { Graph as IGraph, Node, Edge, Bounds, Feature } from '../../types';
declare type IndexedNode = Bounds & {
    node: Node;
};
export declare class BrowserGraph implements IGraph {
    graph: Graph<Node, Edge>;
    spatialIndex: RBush<IndexedNode>;
    fulltextIndex: Fuse<Node>;
    constructor(index?: string[]);
    init: (nodes: Node[], edges: Edge[]) => void;
    addNode: (n: Node) => void;
    addEdge: (e: Edge) => void;
    countNodes: () => number;
    countEdges: () => number;
    getNodeById: (id: string) => Node;
    getConnectedSync: (id: string) => Node[];
    getConnected: (id: string) => Promise<Node[]>;
    getColocatedRecursive: (node: Node, maxHops?: number, spentHops?: number, aggregated?: Node[]) => Node[];
    getNodesInBounds: (bounds: number[]) => Node[];
    getAllFeatures: () => Feature[];
    search: (query: string) => Node[];
}
export {};
//# sourceMappingURL=browserGraph.d.ts.map