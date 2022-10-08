
import React from 'react';
import { GraphContext, Node, Edge, BrowserGraph } from './graph';

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