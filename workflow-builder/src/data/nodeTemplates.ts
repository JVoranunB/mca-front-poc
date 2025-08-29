import type { NodeTemplate } from '../types/workflow.types';

export const nodeTemplates: NodeTemplate[] = [
  // Triggers - Flexible Event-Based and Scheduled
  {
    type: 'trigger',
    label: 'Event-based trigger',
    description: 'Triggers when data changes occur in real-time (MongoDB change streams)',
    icon: 'PlayIcon',
    category: 'triggers',
    defaultConfig: {
      triggerCategory: 'event-based',
      dataSource: 'mongodb',
      changeStreamEnabled: true,
      collections: ['orders'],
      merchantId: ''
    }
  },
  {
    type: 'trigger',
    label: 'Scheduled trigger',
    description: 'Triggers based on date/time schedules with timezone support',
    icon: 'ClockIcon',
    category: 'triggers',
    defaultConfig: {
      triggerCategory: 'scheduled',
      dataSource: 'crm',
      scheduleType: 'recurring',
      recurrencePattern: 'daily',
      scheduleTime: '09:00',
      timezone: 'UTC',
      merchantId: ''
    }
  },
  
  // Conditions
  {
    type: 'condition',
    label: 'Check collection status',
    description: 'Verify collection published status',
    icon: 'HelpIcon',
    category: 'conditions',
    defaultConfig: {}
  },
  {
    type: 'condition',
    label: 'Check order value',
    description: 'Compare order total amount',
    icon: 'HelpIcon',
    category: 'conditions',
    defaultConfig: {
      comparison: 'greater_than',
      value: 100
    }
  },
  {
    type: 'condition',
    label: 'Check customer tags',
    description: 'Verify customer has specific tags',
    icon: 'HelpIcon',
    category: 'conditions',
    defaultConfig: {
      tags: []
    }
  },
  {
    type: 'condition',
    label: 'Check inventory',
    description: 'Verify product stock levels',
    icon: 'HelpIcon',
    category: 'conditions',
    defaultConfig: {
      comparison: 'greater_than',
      quantity: 0
    }
  },
  
  // Actions - Marketing Automation
  {
    type: 'action',
    label: 'Send SMS notification',
    description: 'Send SMS with dynamic content based on trigger data',
    icon: 'MobileIcon',
    category: 'actions',
    defaultConfig: {
      template: '',
      phoneField: 'phone_number',
      includeCustomerData: true
    }
  },
  {
    type: 'action',
    label: 'Send email campaign',
    description: 'Send personalized email with campaign templates',
    icon: 'EmailIcon',
    category: 'actions',
    defaultConfig: {
      campaignTemplate: '',
      emailField: 'email',
      subject: '',
      includeCustomerData: true
    }
  },
  {
    type: 'action',
    label: 'Trigger webhook',
    description: 'Call external API with customer and trigger data',
    icon: 'ExportIcon',
    category: 'actions',
    defaultConfig: {
      url: '',
      method: 'POST',
      includeCustomerData: true,
      headers: {}
    }
  },
  {
    type: 'action',
    label: 'Update customer data',
    description: 'Update customer profile fields in CRM',
    icon: 'CustomerIcon',
    category: 'actions',
    defaultConfig: {
      updates: {},
      dataSource: 'crm'
    }
  },
  {
    type: 'action',
    label: 'Issue reward',
    description: 'Issue points, coupons, or other rewards to customer',
    icon: 'GiftIcon',
    category: 'actions',
    defaultConfig: {
      rewardType: 'points',
      amount: 100,
      expiryDays: 30
    }
  },
  {
    type: 'action',
    label: 'Add tags',
    description: 'Add tags to customer profile',
    icon: 'HashtagIcon',
    category: 'actions',
    defaultConfig: {
      tags: [],
      dataSource: 'crm'
    }
  },
  
  // Utilities
  {
    type: 'step',
    label: 'Wait',
    description: 'Pause workflow execution',
    icon: 'ClockIcon',
    category: 'utilities',
    defaultConfig: {
      duration: 60,
      unit: 'seconds'
    }
  },
  {
    type: 'step',
    label: 'Log message',
    description: 'Add entry to workflow log',
    icon: 'NoteIcon',
    category: 'utilities',
    defaultConfig: {
      message: '',
      level: 'info'
    }
  }
];