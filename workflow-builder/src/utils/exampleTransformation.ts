// Example showing how a frontend workflow gets transformed to backend format

import type { Workflow } from '../types/workflow.types';
import { WorkflowTransformer } from './workflowTransformer';

// Example frontend workflow
const exampleFrontendWorkflow: Workflow = {
  id: 'wf_example_12345',
  name: 'Customer SMS Notification',
  description: 'Send SMS when customer makes a purchase',
  triggerType: 'event-based',
  status: 'draft',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
  nodes: [
    {
      id: 'start-node',
      type: 'start',
      position: { x: 100, y: 100 },
      data: {
        label: 'Start',
        type: 'start',
        description: 'Workflow starting point',
        config: {
          merchantId: 'merchant_123',
          dataSource: 'CRM'
        }
      }
    },
    {
      id: 'condition-1',
      type: 'condition',
      position: { x: 300, y: 100 },
      data: {
        label: 'Check Purchase Amount',
        type: 'condition',
        description: 'Check if purchase amount is greater than $100',
        conditions: [
          {
            id: 'cond1',
            dataSource: 'CRM',
            collection: 'orders',
            field: 'total_amount',
            fieldType: 'number',
            operator: 'greater_than',
            value: 100
          }
        ]
      }
    },
    {
      id: 'sms-action',
      type: 'action',
      position: { x: 500, y: 100 },
      data: {
        label: 'Send SMS notification',
        type: 'action',
        description: 'Send SMS to customer',
        config: {
          message: 'Thank you {{customer_name}} for your purchase of ${{total_amount}}!',
          phoneField: 'phone_number'
        }
      }
    }
  ],
  edges: [
    {
      id: 'edge1',
      source: 'start-node',
      target: 'condition-1',
      sourceHandle: 'output',
      targetHandle: 'input'
    },
    {
      id: 'edge2',
      source: 'condition-1',
      target: 'sms-action',
      sourceHandle: 'then',
      targetHandle: 'input',
      label: 'Then'
    }
  ]
};

// Transform to backend format
const backendWorkflow = WorkflowTransformer.transformToBackend(exampleFrontendWorkflow);

console.log('Frontend Workflow:', JSON.stringify(exampleFrontendWorkflow, null, 2));
console.log('\\n--- TRANSFORMED TO BACKEND FORMAT ---\\n');
console.log('Backend Workflow:', JSON.stringify(backendWorkflow, null, 2));

// Expected output will be:
/*
{
  "workflow_id": "wf_example_12345",
  "name": "Customer SMS Notification",
  "version": "1.0",
  "status": "draft",
  "actions": [
    {
      "action_id": "start-Start-node",
      "key": "a1",
      "type": "trigger",
      "config": {
        "event": "workflow_start",
        "merchantId": "merchant_123",
        "dataSource": "CRM"
      },
      "mapper": null
    },
    {
      "action_id": "condition-Check Purchase Amount-tion-1",
      "key": "a2",
      "type": "condition",
      "config": {
        "conditions": "ctx.crm.total_amount > 100"
      },
      "mapper": null
    },
    {
      "action_id": "action-Send SMS notification-action",
      "key": "a3",
      "type": "action",
      "config": {
        "actionType": "sms",
        "message": "Thank you {{customer_name}} for your purchase of ${{total_amount}}!",
        "phoneField": "phone_number"
      },
      "mapper": {
        "value": {
          "mode": "expression",
          "value": "Thank you ' + ctx.contacts.customer_name + ' for your purchase of $' + ctx.contacts.total_amount + '!"
        }
      }
    }
  ],
  "peers": [
    {
      "parent_key": "a1",
      "child_key": "a2",
      "meta_output": "triggered"
    },
    {
      "parent_key": "a2",
      "child_key": "a3",
      "meta_output": "then"
    }
  ]
}
*/

export { exampleFrontendWorkflow, backendWorkflow };