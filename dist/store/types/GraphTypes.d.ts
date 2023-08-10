export interface Graph {
    getNodeById(id: string): Node | undefined;
    getConnected(id: string): Promise<Node[]>;
}
export interface Node {
    id: string;
    [key: string]: any;
}
export interface Edge {
    source: string;
    target: string;
}
export interface Feature extends Node {
    properties: {
        [key: string]: any;
    };
    geometry: {
        type: string;
        coordinates: number[];
    };
}
export interface Bounds {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}
//# sourceMappingURL=GraphTypes.d.ts.map