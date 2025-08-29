// Map data sources to available fields based on the PostgreSQL schema
export const DATA_SOURCE_FIELDS = {
  mongodb: {
    orders: [
      { key: 'total_amount', label: 'Order Value', type: 'number' as const },
      { key: 'status', label: 'Order Status', type: 'select' as const, options: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] },
      { key: 'created_date', label: 'Order Date', type: 'date' as const },
      { key: 'item_count', label: 'Number of Items', type: 'number' as const },
      { key: 'customer_id', label: 'Customer ID', type: 'text' as const },
      { key: 'payment_method', label: 'Payment Method', type: 'select' as const, options: ['credit_card', 'paypal', 'stripe', 'cash'] },
      { key: 'shipping_country', label: 'Shipping Country', type: 'text' as const },
      { key: 'discount_amount', label: 'Discount Amount', type: 'number' as const }
    ],
    customers: [
      { key: 'registration_date', label: 'Registration Date', type: 'date' as const },
      { key: 'total_orders', label: 'Total Orders', type: 'number' as const },
      { key: 'customer_tier', label: 'Customer Tier', type: 'select' as const, options: ['bronze', 'silver', 'gold', 'platinum'] },
      { key: 'last_login_date', label: 'Last Login', type: 'date' as const },
      { key: 'email_verified', label: 'Email Verified', type: 'select' as const, options: ['true', 'false'] },
      { key: 'lifetime_value', label: 'Lifetime Value', type: 'number' as const },
      { key: 'preferred_language', label: 'Preferred Language', type: 'select' as const, options: ['en', 'es', 'fr', 'de', 'zh'] }
    ],
    products: [
      { key: 'stock_quantity', label: 'Stock Level', type: 'number' as const },
      { key: 'category_id', label: 'Product Category', type: 'text' as const },
      { key: 'price', label: 'Product Price', type: 'number' as const },
      { key: 'last_updated', label: 'Last Updated', type: 'date' as const },
      { key: 'is_featured', label: 'Featured Product', type: 'select' as const, options: ['true', 'false'] },
      { key: 'vendor_id', label: 'Vendor ID', type: 'text' as const },
      { key: 'weight', label: 'Product Weight', type: 'number' as const }
    ],
    inventory: [
      { key: 'available_quantity', label: 'Available Quantity', type: 'number' as const },
      { key: 'reorder_threshold', label: 'Reorder Threshold', type: 'number' as const },
      { key: 'last_restocked', label: 'Last Restocked', type: 'date' as const },
      { key: 'warehouse_location', label: 'Warehouse Location', type: 'text' as const },
      { key: 'reserved_quantity', label: 'Reserved Quantity', type: 'number' as const }
    ],
    carts: [
      { key: 'cart_value', label: 'Cart Value', type: 'number' as const },
      { key: 'abandoned_date', label: 'Abandoned Date', type: 'date' as const },
      { key: 'item_count', label: 'Items in Cart', type: 'number' as const },
      { key: 'has_discount', label: 'Has Discount', type: 'select' as const, options: ['true', 'false'] }
    ]
  },
  crm: {
    customer_profiles: [
      { key: 'birthday', label: 'Birthday', type: 'date' as const },
      { key: 'anniversary_date', label: 'Anniversary', type: 'date' as const },
      { key: 'loyalty_points', label: 'Loyalty Points', type: 'number' as const },
      { key: 'last_purchase_date', label: 'Last Purchase', type: 'date' as const },
      { key: 'preferred_contact', label: 'Contact Preference', type: 'select' as const, options: ['email', 'sms', 'phone', 'push'] },
      { key: 'vip_status', label: 'VIP Status', type: 'select' as const, options: ['true', 'false'] },
      { key: 'referral_count', label: 'Referrals Made', type: 'number' as const },
      { key: 'subscription_status', label: 'Subscription Status', type: 'select' as const, options: ['active', 'inactive', 'paused', 'cancelled'] },
      { key: 'engagement_score', label: 'Engagement Score', type: 'number' as const },
      { key: 'last_campaign_interaction', label: 'Last Campaign Interaction', type: 'date' as const }
    ]
  }
};

export interface DataSourceField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: string[];
}

export const getFieldsForDataSource = (dataSource: string, collection?: string): DataSourceField[] => {
  if (dataSource === 'mongodb' && collection) {
    return DATA_SOURCE_FIELDS.mongodb[collection as keyof typeof DATA_SOURCE_FIELDS.mongodb] || [];
  }
  if (dataSource === 'crm') {
    return DATA_SOURCE_FIELDS.crm.customer_profiles;
  }
  return [];
};

export const getCollectionsForDataSource = (dataSource: string): string[] => {
  if (dataSource === 'mongodb') {
    return Object.keys(DATA_SOURCE_FIELDS.mongodb);
  }
  if (dataSource === 'crm') {
    return ['customer_profiles'];
  }
  return [];
};

export const getOperatorsForFieldType = (fieldType: 'text' | 'number' | 'date' | 'select'): string[] => {
  switch (fieldType) {
    case 'text':
      return ['equals', 'not_equals', 'contains', 'not_contains', 'is_empty', 'is_not_empty'];
    case 'number':
      return ['equals', 'not_equals', 'greater_than', 'less_than', 'greater_equal', 'less_equal', 'is_empty', 'is_not_empty'];
    case 'date':
      return ['equals', 'not_equals', 'date_before', 'date_after', 'is_empty', 'is_not_empty'];
    case 'select':
      return ['equals', 'not_equals', 'is_empty', 'is_not_empty'];
    default:
      return ['equals', 'not_equals'];
  }
};

export const getDataSourcesForConditions = () => [
  { label: 'MongoDB', value: 'mongodb' },
  { label: 'CRM', value: 'crm' }
];

export const getFieldsForCollection = (dataSource: 'mongodb' | 'crm', collection: string): DataSourceField[] => {
  if (dataSource === 'mongodb') {
    return DATA_SOURCE_FIELDS.mongodb[collection as keyof typeof DATA_SOURCE_FIELDS.mongodb] || [];
  }
  if (dataSource === 'crm') {
    return DATA_SOURCE_FIELDS.crm[collection as keyof typeof DATA_SOURCE_FIELDS.crm] || [];
  }
  return [];
};

export const getOperatorLabel = (operator: string): string => {
  const labels: Record<string, string> = {
    'equals': 'Equals',
    'not_equals': 'Not Equals',
    'greater_than': 'Greater Than',
    'less_than': 'Less Than',
    'greater_equal': 'Greater or Equal',
    'less_equal': 'Less or Equal',
    'contains': 'Contains',
    'not_contains': 'Does Not Contain',
    'date_before': 'Before',
    'date_after': 'After',
    'is_empty': 'Is Empty',
    'is_not_empty': 'Is Not Empty'
  };
  return labels[operator] || operator;
};