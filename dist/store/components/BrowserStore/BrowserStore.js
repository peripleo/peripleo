import React from 'react';
import { BrowserSearchHandler } from './BrowserSearchHandler';
import { BrowserGraphProvider } from './BrowserGraphProvider';
export const BrowserStore = (props) => {
    return (React.createElement(BrowserGraphProvider, { nodes: props.nodes, edges: props.edges, index: props.index },
        React.createElement(BrowserSearchHandler, null, props.children)));
};
//# sourceMappingURL=BrowserStore.js.map