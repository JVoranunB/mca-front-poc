# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a React-based workflow automation builder POC that mimics Shopify Flow. The main application lives in the `workflow-builder/` directory.

### Key Architecture Components

- **React Flow Canvas**: Visual workflow editor using `@xyflow/react` for drag-and-drop node connections
- **Shopify Polaris UI**: Complete integration with Shopify's design system for consistent UI components
- **Zustand State Management**: Centralized state in `src/store/workflowStore.ts` with localStorage persistence
- **Node-based Architecture**: Four node types (trigger, condition, action, step) with custom React Flow components
- **TypeScript Types**: Comprehensive type definitions in `src/types/workflow.types.ts`

### Component Structure

```
src/
├── components/
│   ├── nodes/                  # Custom React Flow node components
│   │   ├── TriggerNode.tsx     # Purple nodes - workflow entry points
│   │   ├── ConditionNode.tsx   # Green nodes - decision logic with Then/Otherwise branches
│   │   ├── ActionNode.tsx      # Teal nodes - workflow actions
│   │   └── StepNode.tsx        # Indigo nodes - utility steps
│   ├── NodeSidebar.tsx         # Left sidebar with draggable node templates
│   ├── PropertiesSidebar.tsx   # Right sidebar for node configuration
│   ├── TopBar.tsx              # Navigation with save/load/clear actions
│   └── WorkflowCanvas.tsx      # Main React Flow canvas
├── store/workflowStore.ts      # Zustand store with all workflow state
├── types/workflow.types.ts     # TypeScript definitions
└── data/
    ├── nodeTemplates.ts        # Available node templates by category
    └── sampleWorkflows.ts      # Sample workflow data
```

## Development Commands

**Working Directory**: Always run commands from `workflow-builder/` directory.

```bash
cd workflow-builder

# Development
npm run dev          # Start development server (localhost:5173)
npm run build        # Build for production (TypeScript + Vite)
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Installation
npm install          # Install dependencies
```

## State Management Architecture

The application uses Zustand for state management with the following key patterns:

- **Centralized Store**: `workflowStore.ts` handles all nodes, edges, workflows, and validation
- **Real-time Updates**: Changes automatically trigger React Flow re-renders
- **Persistence**: Workflows saved to localStorage with JSON serialization
- **Validation System**: Built-in workflow validation with error/warning states
- **Dirty State Tracking**: Tracks unsaved changes for user notifications

### Key Store Methods

- `addNode()`, `updateNode()`, `deleteNode()` - Node operations
- `onNodesChange()`, `onEdgesChange()` - React Flow integration
- `saveWorkflow()`, `loadWorkflow()` - Persistence operations
- `validateWorkflow()` - Workflow validation with error reporting

## Node System Architecture

### Node Types and Behaviors

1. **Trigger Nodes**: Single entry points, no input handles, colored purple
2. **Condition Nodes**: Decision logic with "then" and "otherwise" output handles, colored green
3. **Action Nodes**: Workflow actions, single input/output, colored teal
4. **Step Nodes**: Utility functions, single input/output, colored indigo

### Custom Node Implementation

Each node type has:
- Custom React component with Polaris design
- Type-specific handles and styling
- Configuration panel integration
- Validation logic in store

### Adding New Node Types

1. Create component in `src/components/nodes/`
2. Add to `nodeTypes` export in `src/components/nodes/index.ts`
3. Update `NodeType` union in `workflow.types.ts`
4. Add template to `nodeTemplates.ts`
5. Update validation logic in store if needed

## Drag and Drop System

- Templates dragged from left sidebar onto canvas
- Uses React DnD with React Flow integration
- Position calculated relative to canvas viewport
- New nodes created with unique IDs and default configuration

## Validation System

Workflow validation runs automatically and checks:
- At least one trigger node (error if none, warning if multiple)
- All non-trigger nodes have incoming connections
- Condition nodes have both "then" and "otherwise" branches connected
- Results displayed as errors/warnings in UI

## Polaris Integration

Complete Shopify Polaris integration:
- `AppProvider` wraps entire application
- Cards for node representations
- Badges for node status indicators
- Form components for node configuration
- Modals for save/load workflows
- Toast notifications for user feedback

please save my claude token use.