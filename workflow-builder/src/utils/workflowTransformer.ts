import type { Workflow, WorkflowNode, WorkflowEdge } from '../types/workflow.types';
import type { BackendWorkflow, BackendWorkflowAction, BackendWorkflowPeer } from '../services/workflowApi';

interface NodeMapping {
  [nodeId: string]: string; // Maps frontend node IDs to backend action keys
}

export class WorkflowTransformer {
  /**
   * Transform a frontend workflow to backend format
   */
  static transformToBackend(workflow: Workflow): BackendWorkflow {
    const nodeMapping: NodeMapping = {};
    let actionCounter = 1;

    // Create mapping from node IDs to action keys
    workflow.nodes.forEach((node) => {
      nodeMapping[node.id] = `a${actionCounter}`;
      actionCounter++;
    });

    // Transform nodes to actions
    const actions: BackendWorkflowAction[] = workflow.nodes.map((node) => {
      return this.transformNodeToAction(node, nodeMapping);
    });

    // Transform edges to peers
    const peers: BackendWorkflowPeer[] = workflow.edges.map((edge) => {
      return this.transformEdgeToPeer(edge, nodeMapping);
    });

    return {
      workflow_id: workflow.id,
      name: workflow.name,
      version: '1.0',
      status: workflow.status,
      actions,
      peers,
    };
  }

  /**
   * Transform a frontend node to backend action
   */
  private static transformNodeToAction(node: WorkflowNode, nodeMapping: NodeMapping): BackendWorkflowAction {
    const actionKey = nodeMapping[node.id];
    
    // Base action structure
    const action: BackendWorkflowAction = {
      action_id: this.generateActionId(node),
      key: actionKey,
      type: this.mapNodeTypeToActionType(node.data.type),
      config: this.transformNodeConfig(node),
      mapper: this.createMapper(node),
    };

    return action;
  }

  /**
   * Generate action ID based on node type and label
   */
  private static generateActionId(node: WorkflowNode): string {
    const type = node.data.type;
    const label = node.data.label.toLowerCase().replace(/\s+/g, '-');
    return `${type}-${label}-${node.id.slice(-6)}`;
  }

  /**
   * Map frontend node types to backend action types
   */
  private static mapNodeTypeToActionType(nodeType: string): 'trigger' | 'action' | 'condition' | 'step' {
    switch (nodeType) {
      case 'start':
        return 'trigger';
      case 'trigger':
        return 'trigger';
      case 'condition':
        return 'condition';
      case 'action':
        return 'action';
      case 'step':
        return 'step';
      default:
        return 'action';
    }
  }

  /**
   * Transform node configuration for backend
   */
  private static transformNodeConfig(node: WorkflowNode): Record<string, unknown> {
    const config: Record<string, unknown> = {};

    switch (node.data.type) {
      case 'start':
        config.event = 'workflow_start';
        config.merchantId = node.data.config?.merchantId || '';
        config.dataSource = node.data.config?.dataSource || 'CRM';
        break;

      case 'condition':
        if (node.data.conditions && node.data.conditions.length > 0) {
          const conditionStrings = node.data.conditions.map((condition) => {
            const field = `ctx.${condition.dataSource?.toLowerCase()}.${condition.field}`;
            const operator = this.mapOperatorToExpression(condition.operator);
            const value = typeof condition.value === 'string' ? `'${condition.value}'` : condition.value;
            
            switch (condition.operator) {
              case 'is_empty':
                return `!${field}`;
              case 'is_not_empty':
                return `${field}`;
              default:
                return `${field} ${operator} ${value}`;
            }
          });

          // Combine conditions with logical operators
          config.conditions = conditionStrings.reduce((acc, condition, index) => {
            if (index === 0) return condition;
            const logicalOp = node.data.conditions?.[index]?.logicalOperator === 'OR' ? '||' : '&&';
            return `${acc} ${logicalOp} ${condition}`;
          });
        }
        break;

      case 'action':
        config.actionType = this.getActionType(node.data.label);
        Object.assign(config, node.data.config || {});
        break;

      case 'step':
        config.stepType = this.getStepType(node.data.label);
        Object.assign(config, node.data.config || {});
        break;
    }

    return config;
  }

  /**
   * Create mapper for actions that need data transformation
   */
  private static createMapper(node: WorkflowNode): BackendWorkflowAction['mapper'] {
    if (node.data.type === 'action') {
      // For notification actions, create dynamic content mapping
      if (node.data.label.includes('SMS') || node.data.label.includes('email') || node.data.label.includes('LINE')) {
        const config = node.data.config as Record<string, unknown>;
        const message = String(config?.message || config?.body || '');
        if (message) {
          return {
            value: {
              mode: 'expression',
              value: this.transformMessageTemplate(message),
            },
          };
        }
      }

      // For webhook actions
      if (node.data.label.includes('webhook')) {
        return {
          value: {
            mode: 'expression',
            value: 'ctx.triggerData', // Pass trigger data to webhook
          },
        };
      }
    }

    return null;
  }

  /**
   * Transform message template with variables to expression
   */
  private static transformMessageTemplate(template: string): string {
    // Replace {{variable_name}} with ctx.contacts.variable_name
    return template.replace(/\{\{(\w+)\}\}/g, "' + ctx.contacts.$1 + '");
  }

  /**
   * Map condition operators to JavaScript expressions
   */
  private static mapOperatorToExpression(operator: string): string {
    const operatorMap: Record<string, string> = {
      equals: '==',
      not_equals: '!=',
      greater_than: '>',
      less_than: '<',
      greater_equal: '>=',
      less_equal: '<=',
      contains: '.includes',
      not_contains: '!.includes',
    };

    return operatorMap[operator] || '==';
  }

  /**
   * Get action type from node label
   */
  private static getActionType(label: string): string {
    if (label.includes('SMS')) return 'sms';
    if (label.includes('email')) return 'email';
    if (label.includes('LINE')) return 'line';
    if (label.includes('webhook')) return 'webhook';
    if (label.includes('tags')) return 'tags';
    return 'generic';
  }

  /**
   * Get step type from node label
   */
  private static getStepType(label: string): string {
    if (label.includes('Wait')) return 'wait';
    if (label.includes('Log')) return 'log';
    return 'generic';
  }

  /**
   * Transform edge to peer relationship
   */
  private static transformEdgeToPeer(edge: WorkflowEdge, nodeMapping: NodeMapping): BackendWorkflowPeer {
    const peer: BackendWorkflowPeer = {
      parent_key: nodeMapping[edge.source],
      child_key: nodeMapping[edge.target],
    };

    // Add meta_output for condition branches
    if (edge.sourceHandle) {
      peer.meta_output = edge.sourceHandle;
    } else {
      peer.meta_output = 'triggered';
    }

    return peer;
  }

  /**
   * Validate transformed workflow
   */
  static validateBackendWorkflow(workflow: BackendWorkflow): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check required fields
    if (!workflow.workflow_id) errors.push('Missing workflow_id');
    if (!workflow.name) errors.push('Missing workflow name');
    if (!workflow.actions || workflow.actions.length === 0) errors.push('No actions defined');

    // Check for trigger action
    const hasTrigger = workflow.actions.some(action => action.type === 'trigger');
    if (!hasTrigger) errors.push('Workflow must have at least one trigger');

    // Validate peers reference existing actions
    const actionKeys = new Set(workflow.actions.map(action => action.key));
    workflow.peers.forEach(peer => {
      if (!actionKeys.has(peer.parent_key)) {
        errors.push(`Peer references non-existent parent action: ${peer.parent_key}`);
      }
      if (!actionKeys.has(peer.child_key)) {
        errors.push(`Peer references non-existent child action: ${peer.child_key}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}