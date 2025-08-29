import React, { useCallback, useRef, useState, useEffect } from 'react';
import { AppProvider, Frame, Loading } from '@shopify/polaris';
import { ReactFlowProvider } from '@xyflow/react';
import type { ReactFlowInstance } from '@xyflow/react';
import '@shopify/polaris/build/esm/styles.css';
import '@xyflow/react/dist/style.css';
import './styles/reactflow-polaris.css';

import TopBar from './components/TopBar';
import NodeSidebar from './components/NodeSidebar';
import PropertiesSidebar from './components/PropertiesSidebar';
import WorkflowCanvas from './components/WorkflowCanvas';
import useWorkflowStore from './store/workflowStore';
import type { NodeTemplate, WorkflowNode } from './types/workflow.types';
import { sampleWorkflows } from './data/sampleWorkflows';

function App() {
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addNode } = useWorkflowStore();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Load first sample workflow on initial load if no nodes exist
    // Only run once on mount to prevent duplicate loading
    const store = useWorkflowStore.getState();
    if (store.nodes.length === 0 && store.edges.length === 0) {
      const firstSample = sampleWorkflows[0];
      if (firstSample) {
        firstSample.nodes.forEach((node: WorkflowNode) => store.addNode(node));
        firstSample.edges.forEach((edge) => store.addEdge(edge));
      }
    }
    setIsLoading(false);
  }, []); // Empty dependency array to run only once
  
  const onDragStart = (event: React.DragEvent, nodeTemplate: NodeTemplate) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeTemplate));
    event.dataTransfer.effectAllowed = 'move';
  };
  
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const nodeTemplateData = event.dataTransfer.getData('application/reactflow');
      
      if (!nodeTemplateData || !reactFlowBounds || !reactFlowInstance) {
        return;
      }
      
      const nodeTemplate = JSON.parse(nodeTemplateData) as NodeTemplate;
      
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left - 140,
        y: event.clientY - reactFlowBounds.top - 30,
      });
      
      const newNode: WorkflowNode = {
        id: `node-${Date.now()}`,
        type: nodeTemplate.type,
        position,
        data: {
          label: nodeTemplate.label,
          type: nodeTemplate.type,
          description: nodeTemplate.description,
          icon: nodeTemplate.icon,
          config: nodeTemplate.defaultConfig || {},
          conditions: nodeTemplate.type === 'condition' ? [] : undefined,
        },
      };
      
      addNode(newNode);
    },
    [reactFlowInstance, addNode]
  );
  
  if (isLoading) {
    return (
      <AppProvider i18n={{}}>
        <Frame>
          <Loading />
        </Frame>
      </AppProvider>
    );
  }
  
  return (
    <AppProvider i18n={{}}>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <TopBar />
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <NodeSidebar onDragStart={onDragStart} />
          <div ref={reactFlowWrapper} style={{ flex: 1 }}>
            <ReactFlowProvider>
              <WorkflowCanvas
                onDrop={onDrop}
                onDragOver={onDragOver}
                setReactFlowInstance={setReactFlowInstance}
              />
            </ReactFlowProvider>
          </div>
          <PropertiesSidebar />
        </div>
      </div>
    </AppProvider>
  );
}

export default App
