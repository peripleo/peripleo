import React from 'react';
import { BrowserGraph } from './browserGraph';
import { GraphContext } from '../../hooks';
export const BrowserGraphProvider = (props) => {
    const graph = new BrowserGraph(props.index);
    if (props.nodes) {
        const edges = props.edges || [];
        graph.init(props.nodes, edges);
    }
    return (React.createElement(GraphContext.Provider, { value: graph }, props.children));
};
//# sourceMappingURL=BrowserGraphProvider.js.map