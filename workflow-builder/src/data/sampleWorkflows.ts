import type { Workflow } from '../types/workflow.types';

export const sampleWorkflows: Workflow[] = [
  {
    id: 'sample-1',
    name: 'High Value Customer Follow-up',
    description: 'Automatically send SMS to customers who place orders over $500',
    triggerType: 'event-based',
    status: 'draft',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 100, y: 200 },
        data: {
          label: 'New order placed',
          type: 'trigger',
          description: 'Monitors for new orders in real-time',
          status: 'active',
          config: {
            triggerCategory: 'event-based',
            dataSource: 'mongodb',
            changeStreamEnabled: true,
            collections: ['orders']
          }
        }
      },
      {
        id: 'condition-1',
        type: 'condition',
        position: { x: 400, y: 200 },
        data: {
          label: 'Order value > $500',
          type: 'condition',
          description: 'Check if order total is greater than $500',
          status: 'active',
          conditions: [
            {
              id: 'cond-1',
              dataSource: 'mongodb',
              collection: 'orders',
              field: 'total_amount',
              fieldType: 'number',
              operator: 'greater_than',
              value: 500
            }
          ]
        }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 700, y: 150 },
        data: {
          label: 'Send thank you SMS',
          type: 'action',
          description: 'Send personalized SMS to high-value customers',
          status: 'active',
          config: {
            smsTemplate: 'Thank you for your ${order_total} order! As a valued customer, enjoy 10% off your next purchase.',
            delayMinutes: 0
          }
        }
      },
      {
        id: 'action-2',
        type: 'action',
        position: { x: 700, y: 250 },
        data: {
          label: 'Add to VIP segment',
          type: 'action',
          description: 'Tag customer as VIP for future campaigns',
          status: 'active',
          config: {
            tags: ['VIP', 'High Value Customer'],
            updateCustomerProfile: true
          }
        }
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'trigger-1',
        target: 'condition-1',
        animated: true
      },
      {
        id: 'e2-then',
        source: 'condition-1',
        target: 'action-1',
        sourceHandle: 'then',
        animated: true,
        label: 'Then'
      },
      {
        id: 'e3-then',
        source: 'condition-1',
        target: 'action-2',
        sourceHandle: 'then',
        animated: true,
        label: 'Then'
      }
    ]
  },
  {
    id: 'sample-2',
    name: 'Daily Abandoned Cart Recovery',
    description: 'Send email reminders for abandoned carts every day at 2 PM',
    triggerType: 'schedule-based',
    status: 'draft',
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
    nodes: [
      {
        id: 'trigger-2',
        type: 'trigger',
        position: { x: 100, y: 200 },
        data: {
          label: 'Daily at 2 PM EST',
          type: 'trigger',
          description: 'Scheduled trigger for cart recovery campaign',
          status: 'active',
          config: {
            triggerCategory: 'scheduled',
            dataSource: 'mongodb',
            scheduleType: 'recurring',
            recurrencePattern: 'daily',
            scheduleTime: '14:00',
            timezone: 'America/New_York'
          }
        }
      },
      {
        id: 'condition-2',
        type: 'condition',
        position: { x: 400, y: 200 },
        data: {
          label: 'Cart abandoned > 24 hours',
          type: 'condition',
          description: 'Find carts abandoned more than 24 hours ago',
          status: 'active',
          conditions: [
            {
              id: 'cond-2a',
              dataSource: 'mongodb',
              collection: 'carts',
              field: 'status',
              fieldType: 'select',
              operator: 'equals',
              value: 'abandoned',
              selectOptions: ['abandoned', 'active', 'completed']
            },
            {
              id: 'cond-2b',
              dataSource: 'mongodb',
              collection: 'carts',
              field: 'updated_at',
              fieldType: 'date',
              operator: 'date_before',
              value: '2024-01-14',
              logicalOperator: 'AND'
            }
          ]
        }
      },
      {
        id: 'action-3',
        type: 'action',
        position: { x: 700, y: 150 },
        data: {
          label: 'Send recovery email',
          type: 'action',
          description: 'Email with cart contents and discount code',
          status: 'active',
          config: {
            emailTemplate: 'cart-recovery',
            subject: 'Complete your purchase and save 15%',
            discountCode: 'SAVE15'
          }
        }
      }
    ],
    edges: [
      {
        id: 'e4',
        source: 'trigger-2',
        target: 'condition-2',
        animated: true
      },
      {
        id: 'e5-then',
        source: 'condition-2',
        target: 'action-3',
        sourceHandle: 'then',
        animated: true,
        label: 'Then'
      }
    ]
  },
  {
    id: 'sample-3',
    name: 'New Customer Welcome Series',
    description: 'Multi-step onboarding for first-time customers',
    triggerType: 'event-based',
    status: 'draft',
    createdAt: '2024-01-15T12:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z',
    nodes: [
      {
        id: 'trigger-3',
        type: 'trigger',
        position: { x: 100, y: 200 },
        data: {
          label: 'New customer registered',
          type: 'trigger',
          description: 'Triggered when new customer profile is created',
          status: 'active',
          config: {
            triggerCategory: 'event-based',
            dataSource: 'crm',
            changeStreamEnabled: true,
            collections: ['customer_profiles']
          }
        }
      },
      {
        id: 'condition-3',
        type: 'condition',
        position: { x: 400, y: 200 },
        data: {
          label: 'First-time customer',
          type: 'condition',
          description: 'Check if this is their first account creation',
          status: 'active',
          conditions: [
            {
              id: 'cond-3',
              dataSource: 'crm',
              collection: 'customer_profiles',
              field: 'total_orders',
              fieldType: 'number',
              operator: 'equals',
              value: 0
            }
          ]
        }
      },
      {
        id: 'action-4',
        type: 'action',
        position: { x: 700, y: 100 },
        data: {
          label: 'Send welcome email',
          type: 'action',
          description: 'Immediate welcome message with brand introduction',
          status: 'active',
          config: {
            emailTemplate: 'welcome-new-customer',
            delayMinutes: 0
          }
        }
      },
      {
        id: 'action-5',
        type: 'action',
        position: { x: 700, y: 200 },
        data: {
          label: 'Send discount code',
          type: 'action',
          description: '20% off first order (sent 2 hours later)',
          status: 'active',
          config: {
            emailTemplate: 'first-order-discount',
            discountCode: 'WELCOME20',
            delayMinutes: 120
          }
        }
      },
      {
        id: 'action-6',
        type: 'action',
        position: { x: 700, y: 300 },
        data: {
          label: 'Add welcome tags',
          type: 'action',
          description: 'Tag for segmentation and follow-up campaigns',
          status: 'active',
          config: {
            tags: ['New Customer', 'Welcome Series'],
            updateCustomerProfile: true
          }
        }
      }
    ],
    edges: [
      {
        id: 'e6',
        source: 'trigger-3',
        target: 'condition-3',
        animated: true
      },
      {
        id: 'e7-then',
        source: 'condition-3',
        target: 'action-4',
        sourceHandle: 'then',
        animated: true,
        label: 'Then'
      },
      {
        id: 'e8-then',
        source: 'condition-3',
        target: 'action-5',
        sourceHandle: 'then',
        animated: true,
        label: 'Then'
      },
      {
        id: 'e9-then',
        source: 'condition-3',
        target: 'action-6',
        sourceHandle: 'then',
        animated: true,
        label: 'Then'
      }
    ]
  },
  {
    id: 'sample-4',
    name: 'Weekly Inventory Low Stock Alert',
    description: 'Monitor inventory levels and notify staff of low stock items',
    triggerType: 'schedule-based',
    status: 'draft',
    createdAt: '2024-01-15T13:00:00Z',
    updatedAt: '2024-01-15T13:00:00Z',
    nodes: [
      {
        id: 'trigger-4',
        type: 'trigger',
        position: { x: 100, y: 200 },
        data: {
          label: 'Weekly inventory check',
          type: 'trigger',
          description: 'Every Monday at 9 AM to review inventory levels',
          status: 'active',
          config: {
            triggerCategory: 'scheduled',
            dataSource: 'mongodb',
            scheduleType: 'recurring',
            recurrencePattern: 'weekly',
            dayOfWeek: 1,
            scheduleTime: '09:00',
            timezone: 'UTC'
          }
        }
      },
      {
        id: 'condition-4',
        type: 'condition',
        position: { x: 400, y: 200 },
        data: {
          label: 'Stock below threshold',
          type: 'condition',
          description: 'Items with inventory count less than 10 units',
          status: 'active',
          conditions: [
            {
              id: 'cond-4',
              dataSource: 'mongodb',
              collection: 'inventory',
              field: 'quantity',
              fieldType: 'number',
              operator: 'less_than',
              value: 10
            }
          ]
        }
      },
      {
        id: 'action-7',
        type: 'action',
        position: { x: 700, y: 150 },
        data: {
          label: 'Send webhook to inventory system',
          type: 'action',
          description: 'Notify external inventory management system',
          status: 'active',
          config: {
            webhookUrl: 'https://inventory.example.com/api/low-stock',
            method: 'POST',
            includeProductDetails: true
          }
        }
      },
      {
        id: 'action-8',
        type: 'action',
        position: { x: 700, y: 250 },
        data: {
          label: 'Email inventory manager',
          type: 'action',
          description: 'Weekly low stock report to operations team',
          status: 'active',
          config: {
            emailTemplate: 'low-stock-report',
            recipients: ['inventory@company.com', 'operations@company.com']
          }
        }
      }
    ],
    edges: [
      {
        id: 'e10',
        source: 'trigger-4',
        target: 'condition-4',
        animated: true
      },
      {
        id: 'e11-then',
        source: 'condition-4',
        target: 'action-7',
        sourceHandle: 'then',
        animated: true,
        label: 'Then'
      },
      {
        id: 'e12-then',
        source: 'condition-4',
        target: 'action-8',
        sourceHandle: 'then',
        animated: true,
        label: 'Then'
      }
    ]
  }
];