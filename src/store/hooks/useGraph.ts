import { createContext, useContext } from 'react';
import { Graph } from '../types';

export const GraphContext = createContext<Graph>({} as Graph);

export const useGraph = () => {
  
  return useContext(GraphContext);

}