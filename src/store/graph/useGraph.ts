import { createContext, useContext } from 'react';
import { Graph } from './GraphTypes';

export const GraphContext = createContext<Graph>({} as Graph);

export const useGraph = () => {
  
  return useContext(GraphContext);

}