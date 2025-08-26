import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import type { Connection, NodeChange, EdgeChange } from '@xyflow/react';
import type { WorkflowNode, WorkflowEdge, Workflow, ValidationError } from '../types/workflow.types';

interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNode: WorkflowNode | null;
  selectedEdge: WorkflowEdge | null;
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  validationErrors: ValidationError[];
  isDirty: boolean;
  
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (params: Connection) => void;
  
  addNode: (node: WorkflowNode) => void;
  updateNode: (nodeId: string, data: Partial<WorkflowNode['data']>) => void;
  deleteNode: (nodeId: string) => void;
  
  addEdge: (edge: WorkflowEdge) => void;
  updateEdge: (edgeId: string, data: Partial<WorkflowEdge>) => void;
  deleteEdge: (edgeId: string) => void;
  
  selectNode: (node: WorkflowNode | null) => void;
  selectEdge: (edge: WorkflowEdge | null) => void;
  
  saveWorkflow: (name: string, description?: string) => void;
  loadWorkflow: (workflowId: string) => void;
  clearWorkflow: () => void;
  deleteWorkflow: (workflowId: string) => void;
  
  validateWorkflow: () => boolean;
  setValidationErrors: (errors: ValidationError[]) => void;
  
  setDirty: (isDirty: boolean) => void;
}

const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  selectedEdge: null,
  workflows: JSON.parse(localStorage.getItem('workflows') || '[]'),
  currentWorkflow: null,
  validationErrors: [],
  isDirty: false,
  
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes) as WorkflowNode[],
      isDirty: true
    });
  },
  
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges) as WorkflowEdge[],
      isDirty: true
    });
  },
  
  onConnect: (params) => {
    const newEdge: WorkflowEdge = {
      id: `e${params.source}-${params.target}`,
      source: params.source!,
      target: params.target!,
      sourceHandle: params.sourceHandle || undefined,
      targetHandle: params.targetHandle || undefined,
      animated: true,
      label: params.sourceHandle === 'otherwise' ? 'Otherwise' : params.sourceHandle === 'then' ? 'Then' : undefined,
    };
    
    set((state) => ({
      edges: [...state.edges, newEdge],
      isDirty: true
    }));
  },
  
  addNode: (node) => {
    set((state) => ({
      nodes: [...state.nodes, node],
      isDirty: true
    }));
  },
  
  updateNode: (nodeId, data) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      ),
      isDirty: true
    }));
  },
  
  deleteNode: (nodeId) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      selectedNode: state.selectedNode?.id === nodeId ? null : state.selectedNode,
      isDirty: true
    }));
  },
  
  addEdge: (edge) => {
    set((state) => ({
      edges: [...state.edges, edge],
      isDirty: true
    }));
  },
  
  updateEdge: (edgeId, data) => {
    set((state) => ({
      edges: state.edges.map((edge) =>
        edge.id === edgeId ? { ...edge, ...data } : edge
      ),
      isDirty: true
    }));
  },
  
  deleteEdge: (edgeId) => {
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== edgeId),
      selectedEdge: state.selectedEdge?.id === edgeId ? null : state.selectedEdge,
      isDirty: true
    }));
  },
  
  selectNode: (node) => {
    set({ selectedNode: node, selectedEdge: null });
  },
  
  selectEdge: (edge) => {
    set({ selectedEdge: edge, selectedNode: null });
  },
  
  saveWorkflow: (name, description) => {
    const workflow: Workflow = {
      id: Date.now().toString(),
      name,
      description: description || '',
      nodes: get().nodes,
      edges: get().edges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft'
    };
    
    const workflows = [...get().workflows, workflow];
    localStorage.setItem('workflows', JSON.stringify(workflows));
    
    set({
      workflows,
      currentWorkflow: workflow,
      isDirty: false
    });
  },
  
  loadWorkflow: (workflowId) => {
    const workflow = get().workflows.find((w) => w.id === workflowId);
    if (workflow) {
      set({
        nodes: workflow.nodes,
        edges: workflow.edges,
        currentWorkflow: workflow,
        isDirty: false
      });
    }
  },
  
  clearWorkflow: () => {
    set({
      nodes: [],
      edges: [],
      selectedNode: null,
      selectedEdge: null,
      currentWorkflow: null,
      validationErrors: [],
      isDirty: false
    });
  },
  
  deleteWorkflow: (workflowId) => {
    const workflows = get().workflows.filter((w) => w.id !== workflowId);
    localStorage.setItem('workflows', JSON.stringify(workflows));
    
    set({
      workflows,
      currentWorkflow: get().currentWorkflow?.id === workflowId ? null : get().currentWorkflow
    });
  },
  
  validateWorkflow: () => {
    const errors: ValidationError[] = [];
    const { nodes, edges } = get();
    
    const triggerNodes = nodes.filter((n) => n.data.type === 'trigger');
    if (triggerNodes.length === 0) {
      errors.push({
        message: 'Workflow must have at least one trigger node',
        severity: 'error'
      });
    } else if (triggerNodes.length > 1) {
      errors.push({
        message: 'Workflow should have only one trigger node',
        severity: 'warning'
      });
    }
    
    nodes.forEach((node) => {
      const hasIncoming = edges.some((e) => e.target === node.id);
      
      if (node.data.type !== 'trigger' && !hasIncoming) {
        errors.push({
          nodeId: node.id,
          message: `Node "${node.data.label}" has no incoming connections`,
          severity: 'warning'
        });
      }
      
      if (node.data.type === 'condition') {
        const thenEdge = edges.find((e) => e.source === node.id && e.sourceHandle === 'then');
        const otherwiseEdge = edges.find((e) => e.source === node.id && e.sourceHandle === 'otherwise');
        
        if (!thenEdge || !otherwiseEdge) {
          errors.push({
            nodeId: node.id,
            message: `Condition node "${node.data.label}" must have both Then and Otherwise branches`,
            severity: 'error'
          });
        }
      }
    });
    
    set({ validationErrors: errors });
    return errors.filter((e) => e.severity === 'error').length === 0;
  },
  
  setValidationErrors: (errors) => {
    set({ validationErrors: errors });
  },
  
  setDirty: (isDirty) => {
    set({ isDirty });
  }
}));

export default useWorkflowStore;