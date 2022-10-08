import React from 'react';
import { BrowserSearchHandler } from './BrowserSearchHandler';
import { Node, Edge } from './graph';
import { BrowserGraphProvider } from './BrowserGraphProvider';

type BrowserStoreProps = {

  nodes: Node[]

  edges: Edge[]

  index: string[]

  children: React.ReactElement

}

export const BrowserStore = (props: BrowserStoreProps) => {

  return (
    <BrowserGraphProvider 
      nodes={props.nodes}
      edges={props.edges} 
      index={props.index}>
      
      <BrowserSearchHandler>
        {props.children}
      </BrowserSearchHandler>
    
    </BrowserGraphProvider>
  )

}
