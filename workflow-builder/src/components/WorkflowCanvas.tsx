import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ConnectionMode,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodeTypes } from './nodes';
import useWorkflowStore from '../store/workflowStore';
import type { WorkflowNode } from '../types/workflow.types';

interface WorkflowCanvasProps {
  onDrop: (event: React.DragEvent) => void;
  onDragOver: (event: React.DragEvent) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setReactFlowInstance: (instance: any) => void;
}

const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({ onDrop, onDragOver, setReactFlowInstance }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectNode,
    selectEdge
  } = useWorkflowStore();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onInit = (instance: any) => {
    setReactFlowInstance(instance);
  };
  
  const onNodeClick = useCallback((_event: React.MouseEvent, node: WorkflowNode) => {
    selectNode(node);
  }, [selectNode]);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEdgeClick = useCallback((_event: React.MouseEvent, edge: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selectEdge(edge as any);
  }, [selectEdge]);
  
  const onPaneClick = useCallback(() => {
    selectNode(null);
    selectEdge(null);
  }, [selectNode, selectEdge]);
  
  const edgeOptions = {
    animated: true,
    style: { stroke: '#8c9196', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: '#8c9196'
    }
  };
  
  return (
    <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        defaultEdgeOptions={edgeOptions}
        fitView
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap 
          pannable 
          zoomable 
          nodeColor={(node) => {
            const colors: Record<string, string> = {
              trigger: '#5C6AC4',
              condition: '#95A99C',
              action: '#00848E',
              step: '#6C71C5'
            };
            return colors[node.type || 'default'] || '#8c9196';
          }}
        />
      </ReactFlow>
    </div>
  );
};

export default WorkflowCanvas;