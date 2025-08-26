import type { NodeTemplate } from '../types/workflow.types';

export const nodeTemplates: NodeTemplate[] = [
  // Triggers
  {
    type: 'trigger',
    label: 'Collection created',
    description: 'Triggers when a new collection is created',
    icon: 'FolderIcon',
    category: 'triggers',
    defaultConfig: {
      collection_type: 'all'
    }
  },
  {
    type: 'trigger',
    label: 'Order created',
    description: 'Triggers when a new order is placed',
    icon: 'CartIcon',
    category: 'triggers',
    defaultConfig: {
      order_status: 'any'
    }
  },
  {
    type: 'trigger',
    label: 'Customer created',
    description: 'Triggers when a new customer signs up',
    icon: 'PersonIcon',
    category: 'triggers',
    defaultConfig: {
      customer_group: 'all'
    }
  },
  {
    type: 'trigger',
    label: 'Product updated',
    description: 'Triggers when a product is modified',
    icon: 'ProductIcon',
    category: 'triggers',
    defaultConfig: {
      update_type: 'any'
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
  
  // Actions
  {
    type: 'action',
    label: 'Add order line item',
    description: 'Add a product to the order',
    icon: 'PlusMinorIcon',
    category: 'actions',
    defaultConfig: {
      product_id: '',
      quantity: 1
    }
  },
  {
    type: 'action',
    label: 'Send HTTP request',
    description: 'Make an API call to external service',
    icon: 'ExportIcon',
    category: 'actions',
    defaultConfig: {
      url: '',
      method: 'POST',
      headers: {}
    }
  },
  {
    type: 'action',
    label: 'Add tags',
    description: 'Add tags to resource',
    icon: 'HashtagIcon',
    category: 'actions',
    defaultConfig: {
      tags: []
    }
  },
  {
    type: 'action',
    label: 'Send email',
    description: 'Send notification email',
    icon: 'NotificationIcon',
    category: 'actions',
    defaultConfig: {
      to: '',
      subject: '',
      template: ''
    }
  },
  {
    type: 'action',
    label: 'Update inventory',
    description: 'Adjust product stock levels',
    icon: 'ArchiveIcon',
    category: 'actions',
    defaultConfig: {
      adjustment_type: 'set',
      quantity: 0
    }
  },
  {
    type: 'action',
    label: 'Create discount',
    description: 'Generate a discount code',
    icon: 'MoneyIcon',
    category: 'actions',
    defaultConfig: {
      discount_type: 'percentage',
      value: 10
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