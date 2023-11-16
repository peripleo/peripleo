import { ReactNode } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import { CSSDimension } from '../Types';

import './DraggablePanel.css';

export interface DraggablePanelProps {

  children: ReactNode;

  className?: string;
  
  height?: number;

  left?: number;

  top?: number; 

  width?: number;

}

export const DraggablePanel = (props: DraggablePanelProps) => {

  const { children, className } = props;

  const left = `${props.left || 20}px`;
  
  const top = `${props.left || 20}px`;

  const width = props.width || 400;

  const height = props.height || 500;

  return (
    <Draggable cancel=".react-resizable-handle">
      <ResizableBox 
        className={className ? `p6o-draggable-panel ${className}` : 'p6o-draggable-panel'} 
        style={{ top, left }}
        height={height} 
        width={width}>
        {children}
      </ResizableBox>
    </Draggable>
  )

}