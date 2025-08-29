import type { NodeTemplate, TriggerType } from '../types/workflow.types';

// Event-based trigger templates
export const eventBasedTriggerTemplates: NodeTemplate[] = [
  {
    type: 'trigger',
    label: 'Order created',
    description: 'Triggers when a new order is placed',
    icon: 'CartIcon',
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
    label: 'Customer signed up',
    description: 'Triggers when a new customer registers',
    icon: 'CustomerIcon',
    category: 'triggers',
    defaultConfig: {
      triggerCategory: 'event-based',
      dataSource: 'mongodb',
      changeStreamEnabled: true,
      collections: ['customers'],
      merchantId: ''
    }
  },
  {
    type: 'trigger',
    label: 'Product updated',
    description: 'Triggers when product information changes',
    icon: 'ProductIcon',
    category: 'triggers',
    defaultConfig: {
      triggerCategory: 'event-based',
      dataSource: 'mongodb',
      changeStreamEnabled: true,
      collections: ['products'],
      merchantId: ''
    }
  },
  {
    type: 'trigger',
    label: 'Payment received',
    description: 'Triggers when payment is processed successfully',
    icon: 'PaymentIcon',
    category: 'triggers',
    defaultConfig: {
      triggerCategory: 'event-based',
      dataSource: 'mongodb',
      changeStreamEnabled: true,
      collections: ['payments'],
      merchantId: ''
    }
  }
];

// Schedule-based trigger templates
export const scheduleBasedTriggerTemplates: NodeTemplate[] = [
  {
    type: 'trigger',
    label: 'Daily report',
    description: 'Runs daily at specified time',
    icon: 'CalendarIcon',
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
  {
    type: 'trigger',
    label: 'Weekly summary',
    description: 'Runs weekly on specified day and time',
    icon: 'CalendarIcon',
    category: 'triggers',
    defaultConfig: {
      triggerCategory: 'scheduled',
      dataSource: 'crm',
      scheduleType: 'recurring',
      recurrencePattern: 'weekly',
      scheduleTime: '10:00',
      dayOfWeek: 1, // Monday
      timezone: 'UTC',
      merchantId: ''
    }
  },
  {
    type: 'trigger',
    label: 'Monthly report',
    description: 'Runs monthly on specified day and time',
    icon: 'CalendarIcon',
    category: 'triggers',
    defaultConfig: {
      triggerCategory: 'scheduled',
      dataSource: 'crm',
      scheduleType: 'recurring',
      recurrencePattern: 'monthly',
      scheduleTime: '09:00',
      dayOfMonth: 1,
      timezone: 'UTC',
      merchantId: ''
    }
  },
  {
    type: 'trigger',
    label: 'One-time scheduled',
    description: 'Runs once at specified date and time',
    icon: 'ClockIcon',
    category: 'triggers',
    defaultConfig: {
      triggerCategory: 'scheduled',
      dataSource: 'crm',
      scheduleType: 'one-time',
      scheduleDate: '',
      scheduleTime: '12:00',
      timezone: 'UTC',
      merchantId: ''
    }
  }
];

// Common node templates (shared across trigger types)
export const commonNodeTemplates: NodeTemplate[] = [
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

// Helper function to get templates by trigger type
export const getTemplatesByTriggerType = (triggerType?: TriggerType): NodeTemplate[] => {
  const triggerTemplates = triggerType === 'event-based' 
    ? eventBasedTriggerTemplates 
    : triggerType === 'schedule-based'
    ? scheduleBasedTriggerTemplates
    : [...eventBasedTriggerTemplates, ...scheduleBasedTriggerTemplates];
  
  return [...triggerTemplates, ...commonNodeTemplates];
};

// Backward compatibility - export all templates
export const nodeTemplates: NodeTemplate[] = [
  ...eventBasedTriggerTemplates,
  ...scheduleBasedTriggerTemplates,
  ...commonNodeTemplates
];