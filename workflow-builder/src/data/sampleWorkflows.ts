import type { WorkflowNode, WorkflowEdge } from '../types/workflow.types';

export const sampleNodes: WorkflowNode[] = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 250, y: 50 },
    data: {
      label: 'Collection created',
      type: 'trigger',
      description: 'Triggers when a new collection is created',
      status: 'active',
      config: {
        collection_type: 'all',
        include_drafts: false
      }
    }
  },
  {
    id: '2',
    type: 'condition',
    position: { x: 250, y: 200 },
    data: {
      label: 'Check collection status',
      type: 'condition',
      description: 'Verify collection properties',
      status: 'review',
      conditions: [
        {
          id: 'c1',
          field: 'description_html',
          operator: 'empty',
          value: ''
        },
        {
          id: 'c2',
          field: 'published_status',
          operator: 'equals',
          value: 'published',
          logicalOperator: 'AND'
        },
        {
          id: 'c3',
          field: 'products_count',
          operator: 'greater_than',
          value: '0',
          logicalOperator: 'AND'
        }
      ],
      hasThenBranch: true,
      hasOtherwiseBranch: true
    }
  },
  {
    id: '3',
    type: 'action',
    position: { x: 100, y: 400 },
    data: {
      label: 'Add collection tags',
      type: 'action',
      description: 'Add tags to the collection',
      config: {
        tags: ['new', 'needs-review', 'auto-processed']
      }
    }
  },
  {
    id: '4',
    type: 'action',
    position: { x: 400, y: 400 },
    data: {
      label: 'Send HTTP request',
      type: 'action',
      description: 'Notify external service',
      config: {
        url: 'https://api.example.com/webhooks/collection',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token123'
        }
      }
    }
  },
  {
    id: '5',
    type: 'step',
    position: { x: 100, y: 550 },
    data: {
      label: 'Log activity',
      type: 'step',
      description: 'Record action in audit log',
      config: {
        message: 'Collection processed with tags',
        level: 'info'
      }
    }
  },
  {
    id: '6',
    type: 'action',
    position: { x: 400, y: 550 },
    data: {
      label: 'Send email notification',
      type: 'action',
      description: 'Alert team about new collection',
      status: 'active',
      config: {
        to: 'team@example.com',
        subject: 'New Collection Created',
        template: 'new_collection_alert'
      }
    }
  },
  {
    id: '7',
    type: 'condition',
    position: { x: 400, y: 700 },
    data: {
      label: 'Check email response',
      type: 'condition',
      description: 'Verify email was sent',
      conditions: [
        {
          id: 'c4',
          field: 'email_status',
          operator: 'equals',
          value: 'sent'
        }
      ]
    }
  },
  {
    id: '8',
    type: 'action',
    position: { x: 300, y: 850 },
    data: {
      label: 'Update collection metadata',
      type: 'action',
      description: 'Mark collection as processed',
      config: {
        metafield_namespace: 'workflow',
        metafield_key: 'processed',
        metafield_value: 'true'
      }
    }
  },
  {
    id: '9',
    type: 'action',
    position: { x: 500, y: 850 },
    data: {
      label: 'Retry email',
      type: 'action',
      description: 'Attempt to resend notification',
      status: 'error',
      config: {
        max_retries: 3,
        retry_delay: 300
      }
    }
  }
];

export const sampleEdges: WorkflowEdge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    sourceHandle: 'then',
    label: 'Then',
    animated: true
  },
  {
    id: 'e2-4',
    source: '2',
    target: '4',
    sourceHandle: 'otherwise',
    label: 'Otherwise',
    animated: true
  },
  {
    id: 'e3-5',
    source: '3',
    target: '5',
    animated: true
  },
  {
    id: 'e4-6',
    source: '4',
    target: '6',
    animated: true
  },
  {
    id: 'e6-7',
    source: '6',
    target: '7',
    animated: true
  },
  {
    id: 'e7-8',
    source: '7',
    target: '8',
    sourceHandle: 'then',
    label: 'Then',
    animated: true
  },
  {
    id: 'e7-9',
    source: '7',
    target: '9',
    sourceHandle: 'otherwise',
    label: 'Otherwise',
    animated: true
  }
];