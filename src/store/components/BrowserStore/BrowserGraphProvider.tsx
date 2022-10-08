
import React from 'react';
import { BrowserGraph } from './browserGraph';
import { GraphContext } from '../../hooks';
import { Node, Edge } from '../../types';

type BrowserGraphProviderProps = {

  nodes: Node[]

  edges: Edge[]

  index: string[]

  children: React.ReactElement

}

export const BrowserGraphProvider = (props: BrowserGraphProviderProps) => {

  const graph = new BrowserGraph(props.index);

  if (props.nodes) {
    const edges = props.edges || [];
    graph.init(props.nodes, edges);
  }

  return (
    <GraphContext.Provider value={graph}>
      {props.children}
    </GraphContext.Provider>
  )
  
}