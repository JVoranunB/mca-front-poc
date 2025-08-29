import React, { useCallback, useRef, useEffect } from 'react';
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
import type { WorkflowNode, NodeData, StartConfig } from '../types/workflow.types';

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
    selectEdge,
    selectedEdge,
    deleteEdge,
    addNode
  } = useWorkflowStore();
  
  // Auto-create start node when canvas is empty
  useEffect(() => {
    const hasStartNode = nodes.some(node => node.type === 'start');
    if (nodes.length === 0 || !hasStartNode) {
      const startNode: WorkflowNode = {
        id: 'start-node',
        type: 'start',
        position: { x: 250, y: 200 },
        data: {
          label: 'Start',
          type: 'start',
          description: 'Workflow starting point',
          config: {
            label: 'Workflow Start',
            description: 'Beginning of workflow execution',
            merchantId: '',
            dataSource: 'CRM'
          } as StartConfig
        } as NodeData
      };
      
      // Only add if no start node exists
      if (!hasStartNode) {
        addNode(startNode);
      }
    }
  }, [nodes, addNode]);
  
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

  // Handle edge context menu (right-click)
  const onEdgeContextMenu = useCallback((event: React.MouseEvent, edge: any) => {
    event.preventDefault();
    const confirmDelete = window.confirm('Delete this connection?');
    if (confirmDelete) {
      deleteEdge(edge.id);
      selectEdge(null);
    }
  }, [deleteEdge, selectEdge]);

  // Handle edge deletion with keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedEdge) {
        event.preventDefault();
        deleteEdge(selectedEdge.id);
        selectEdge(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedEdge, deleteEdge, selectEdge]);
  
  const onPaneClick = useCallback(() => {
    selectNode(null);
    selectEdge(null);
  }, [selectNode, selectEdge]);

  // Custom connection validation to ensure proper handle connections and sequential order
  const isValidConnection = useCallback((connection: any) => {
    // Ensure we're connecting from output (source) to input (target)
    // Source handles should be 'output', 'then', or 'otherwise'
    // Target handles should be 'input'
    const validSourceHandles = ['output', 'then', 'otherwise'];
    const validTargetHandles = ['input'];
    
    const isValidSource = !connection.sourceHandle || validSourceHandles.includes(connection.sourceHandle);
    const isValidTarget = !connection.targetHandle || validTargetHandles.includes(connection.targetHandle);
    
    if (!isValidSource || !isValidTarget) {
      return false;
    }

    // Get source and target nodes
    const sourceNode = nodes.find(node => node.id === connection.source);
    const targetNode = nodes.find(node => node.id === connection.target);
    
    if (!sourceNode || !targetNode) {
      return false;
    }

    // Sequential connection validation based on node positions
    // Nodes can only connect to nodes that are positioned to their right and within reasonable vertical range
    const sourceX = sourceNode.position.x;
    const sourceY = sourceNode.position.y;
    const targetX = targetNode.position.x;
    const targetY = targetNode.position.y;

    // Target must be to the right of source (left-to-right flow)
    if (targetX <= sourceX + 50) { // Adding 50px buffer for same-column positioning
      return false;
    }

    // Prevent connecting to nodes that are too far to the right (skip prevention)
    // Find all nodes between source and target horizontally
    const nodesBetween = nodes.filter(node => {
      const nodeX = node.position.x;
      const nodeY = node.position.y;
      
      // Node is between source and target horizontally
      const isBetweenHorizontally = nodeX > sourceX + 50 && nodeX < targetX - 50;
      
      // Node is within reasonable vertical range (same workflow level)
      const verticalDistance = Math.abs(nodeY - sourceY);
      const isInVerticalRange = verticalDistance < 200; // Allow some vertical spacing
      
      // Exclude the source and target nodes themselves
      return isBetweenHorizontally && isInVerticalRange && 
             node.id !== connection.source && node.id !== connection.target;
    });

    // If there are nodes in between, prevent the connection (no crossing over)
    if (nodesBetween.length > 0) {
      console.log('Connection blocked: Cannot skip over intermediate nodes');
      return false;
    }

    return true;
  }, [nodes]);

  // Handle connection line style during drag
  const connectionLineStyle = {
    stroke: '#5C6AC4',
    strokeWidth: 2,
  };

  // Custom connection line component for visual feedback
  const connectionLineComponent = useCallback((props: any) => {
    return (
      <g>
        <path
          fill="none"
          stroke={props.connectionLineStyle?.stroke || '#5C6AC4'}
          strokeWidth={props.connectionLineStyle?.strokeWidth || 2}
          className="animated"
          d={props.connectionPath}
          markerEnd="url(#react-flow__arrowclosed)"
        />
      </g>
    );
  }, []);
  
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
        onEdgeContextMenu={onEdgeContextMenu}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        defaultEdgeOptions={edgeOptions}
        isValidConnection={isValidConnection}
        connectionLineStyle={connectionLineStyle}
        connectionLineComponent={connectionLineComponent}
        fitView
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap 
          pannable 
          zoomable 
          nodeColor={(node) => {
            const colors: Record<string, string> = {
              start: '#8B5A99',
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