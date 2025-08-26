# Workflow Builder POC with React Flow and Shopify Polaris

A professional workflow automation builder application inspired by Shopify Flow, built with React, TypeScript, React Flow, and Shopify Polaris UI components.

## Features

### Core Workflow Capabilities
- **Trigger Nodes**: Start workflows based on events (Collection created, Order created, etc.)
- **Condition Nodes**: Add decision logic with AND/OR operators and multiple conditions
- **Action Nodes**: Execute tasks like sending HTTP requests, adding tags, sending emails
- **Step Nodes**: Simple workflow steps and utilities
- **Multi-branch Logic**: Support for Then/Otherwise branching from condition nodes
- **Visual Flow Editor**: Drag-and-drop interface for building workflows

### UI/UX Features
- **Shopify Polaris Design System**: Professional, consistent UI that matches Shopify's design language
- **Node Library Sidebar**: Organized, draggable node templates by category
- **Properties Panel**: Edit node configurations and conditions
- **Workflow Management**: Save, load, and manage multiple workflows
- **Validation System**: Real-time workflow validation with error/warning indicators
- **Responsive Design**: Fully responsive layout with Polaris components

## Tech Stack

- **React 18** with TypeScript
- **React Flow** (@xyflow/react) for workflow visualization
- **Shopify Polaris** for UI components and design system
- **Zustand** for state management
- **Vite** for build tooling
- **LocalStorage** for persistence (POC)

## Installation

1. Clone the repository
2. Navigate to the project directory:
```bash
cd workflow-builder
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to:
```
http://localhost:5173
```

## Usage Guide

### Creating a Workflow

1. **Add Nodes**: Drag node templates from the left sidebar onto the canvas
2. **Connect Nodes**: Click and drag from output handles to input handles
3. **Configure Nodes**: Click a node to select it, then edit properties in the right sidebar
4. **Add Conditions**: For condition nodes, add multiple conditions with AND/OR logic
5. **Save Workflow**: Click the Save button in the top bar and provide a name

### Node Types

#### Trigger Nodes (Purple)
- Start the workflow based on events
- Examples: Collection created, Order created, Customer created

#### Condition Nodes (Green)
- Add decision logic to workflows
- Support multiple conditions with AND/OR operators
- Create Then/Otherwise branches

#### Action Nodes (Teal)
- Perform actions in the workflow
- Examples: Send HTTP request, Add tags, Send email, Update inventory

#### Step Nodes (Indigo)
- Utility nodes for workflow control
- Examples: Wait, Log message

### Managing Workflows

- **Save**: Save current workflow to localStorage
- **Load**: Load a previously saved workflow
- **Clear**: Clear the canvas to start fresh
- **Validate**: Check workflow for errors and warnings
- **Delete**: Remove saved workflows from storage

## Project Structure

```
workflow-builder/
├── src/
│   ├── components/
│   │   ├── nodes/          # Custom React Flow node components
│   │   │   ├── TriggerNode.tsx
│   │   │   ├── ConditionNode.tsx
│   │   │   ├── ActionNode.tsx
│   │   │   └── StepNode.tsx
│   │   ├── NodeSidebar.tsx      # Left sidebar with draggable nodes
│   │   ├── PropertiesSidebar.tsx # Right sidebar for node properties
│   │   ├── TopBar.tsx           # Top navigation with actions
│   │   └── WorkflowCanvas.tsx   # Main React Flow canvas
│   ├── data/
│   │   ├── nodeTemplates.ts    # Available node templates
│   │   └── sampleWorkflows.ts  # Sample workflow data
│   ├── store/
│   │   └── workflowStore.ts    # Zustand state management
│   ├── styles/
│   │   └── reactflow-polaris.css # Custom styles for React Flow
│   ├── types/
│   │   └── workflow.types.ts   # TypeScript type definitions
│   └── App.tsx                  # Main application component
├── package.json
└── README.md
```

## Key Features Implementation

### Drag and Drop
- Nodes can be dragged from the sidebar onto the canvas
- Uses React DnD events with React Flow integration

### Node Configuration
- Dynamic property forms based on node type
- Support for text inputs, selects, checkboxes
- Condition builder with logical operators

### Workflow Validation
- Checks for required trigger nodes
- Validates condition node branches
- Ensures proper node connections
- Displays errors and warnings

### State Management
- Centralized state with Zustand
- Persistent storage in localStorage
- Real-time updates across components

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Extending the Application

#### Adding New Node Types
1. Create a new component in `src/components/nodes/`
2. Add the node type to `nodeTypes` in `src/components/nodes/index.ts`
3. Update TypeScript types in `workflow.types.ts`
4. Add templates to `nodeTemplates.ts`

#### Adding New Node Properties
1. Update the node data interface in `workflow.types.ts`
2. Add form fields in `PropertiesSidebar.tsx`
3. Update the node component to display new properties

## Polaris Design Integration

The application fully integrates Shopify's Polaris design system:

- **AppProvider**: Wraps the entire application
- **Cards**: Used for all node representations
- **Badges**: Status indicators on nodes
- **Forms**: Node property configuration
- **Modals**: Save/load workflow dialogs
- **Toast**: Success/error notifications
- **Icons**: Consistent Polaris iconography

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Future Enhancements

- Backend integration for workflow persistence
- Real-time collaboration features
- Workflow execution engine
- Advanced node types (loops, parallel execution)
- Import/export workflows as JSON
- Undo/redo functionality
- Keyboard shortcuts
- Node search and filtering
- Workflow templates library
- Performance metrics and analytics

please save my claude token use.