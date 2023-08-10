import { createContext, useContext } from 'react';
export const GraphContext = createContext({});
export const useGraph = () => {
    return useContext(GraphContext);
};
//# sourceMappingURL=useGraph.js.map