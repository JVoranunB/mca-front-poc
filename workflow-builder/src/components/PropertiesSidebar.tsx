import React, { useState, useEffect } from 'react';
import {
  Card,
  Text,
  TextField,
  Select,
  Button,
  BlockStack,
  InlineStack,
  Badge,
  FormLayout,
  Checkbox,
  Divider,
  EmptyState
} from '@shopify/polaris';
import { Icons } from '../utils/icons';
import useWorkflowStore from '../store/workflowStore';
import type { WorkflowCondition } from '../types/workflow.types';

const PropertiesSidebar: React.FC = () => {
  const { selectedNode, updateNode, deleteNode } = useWorkflowStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [localConfig, setLocalConfig] = useState<Record<string, any>>({});
  const [conditions, setConditions] = useState<WorkflowCondition[]>([]);
  
  useEffect(() => {
    if (selectedNode) {
      setLocalConfig(selectedNode.data.config || {});
      setConditions(selectedNode.data.conditions || []);
    }
  }, [selectedNode]);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleConfigChange = (key: string, value: any) => {
    const newConfig = { ...localConfig, [key]: value };
    setLocalConfig(newConfig);
    if (selectedNode) {
      updateNode(selectedNode.id, { config: newConfig });
    }
  };
  
  const handleLabelChange = (value: string) => {
    if (selectedNode) {
      updateNode(selectedNode.id, { label: value });
    }
  };
  
  const handleDescriptionChange = (value: string) => {
    if (selectedNode) {
      updateNode(selectedNode.id, { description: value });
    }
  };
  
  const addCondition = () => {
    const newCondition: WorkflowCondition = {
      id: Date.now().toString(),
      field: '',
      operator: 'equals',
      value: '',
      logicalOperator: conditions.length > 0 ? 'AND' : undefined
    };
    const newConditions = [...conditions, newCondition];
    setConditions(newConditions);
    if (selectedNode) {
      updateNode(selectedNode.id, { conditions: newConditions });
    }
  };
  
  const updateCondition = (id: string, updates: Partial<WorkflowCondition>) => {
    const newConditions = conditions.map(c =>
      c.id === id ? { ...c, ...updates } : c
    );
    setConditions(newConditions);
    if (selectedNode) {
      updateNode(selectedNode.id, { conditions: newConditions });
    }
  };
  
  const removeCondition = (id: string) => {
    const newConditions = conditions.filter(c => c.id !== id);
    setConditions(newConditions);
    if (selectedNode) {
      updateNode(selectedNode.id, { conditions: newConditions });
    }
  };
  
  if (!selectedNode) {
    return (
      <div style={{ width: '360px', height: '100%', borderLeft: '1px solid #e1e3e5', padding: '16px' }}>
        <Card>
          <EmptyState
            heading="No node selected"
            image="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath fill='%23DDD' d='M30 58C45.464 58 58 45.464 58 30S45.464 2 30 2 2 14.536 2 30s12.536 28 28 28z'/%3E%3Cpath fill='%23FFF' d='M30 54C43.255 54 54 43.255 54 30S43.255 6 30 6 6 16.745 6 30s10.745 24 24 24z'/%3E%3Cpath fill='%23DDD' d='M30 50C41.046 50 50 41.046 50 30S41.046 10 30 10 10 18.954 10 30s8.954 20 20 20z'/%3E%3Cpath fill='%23FFF' d='M24 26h12v8H24z'/%3E%3C/g%3E%3C/svg%3E"
          >
            <p>Select a node to view and edit its properties</p>
          </EmptyState>
        </Card>
      </div>
    );
  }
  
  const renderConfigFields = () => {
    if (selectedNode.data.type === 'trigger') {
      return (
        <>
          <Select
            label="Trigger type"
            options={[
              { label: 'All collections', value: 'all' },
              { label: 'Smart collections only', value: 'smart' },
              { label: 'Manual collections only', value: 'manual' }
            ]}
            value={String(localConfig.collection_type || 'all')}
            onChange={(value) => handleConfigChange('collection_type', value)}
          />
          <Checkbox
            label="Include draft collections"
            checked={Boolean(localConfig.include_drafts || false)}
            onChange={(value) => handleConfigChange('include_drafts', value)}
          />
        </>
      );
    }
    
    if (selectedNode.data.type === 'action') {
      if (selectedNode.data.label.includes('HTTP')) {
        return (
          <>
            <TextField
              label="URL"
              value={String(localConfig.url || '')}
              onChange={(value) => handleConfigChange('url', value)}
              autoComplete="off"
            />
            <Select
              label="Method"
              options={[
                { label: 'GET', value: 'GET' },
                { label: 'POST', value: 'POST' },
                { label: 'PUT', value: 'PUT' },
                { label: 'DELETE', value: 'DELETE' }
              ]}
              value={String(localConfig.method || 'POST')}
              onChange={(value) => handleConfigChange('method', value)}
            />
            <TextField
              label="Headers (JSON)"
              value={localConfig.headers ? JSON.stringify(localConfig.headers) : '{}'}
              onChange={(value) => {
                try {
                  handleConfigChange('headers', JSON.parse(value));
                } catch {
                  // Ignore JSON parse errors
                }
              }}
              multiline={3}
              autoComplete="off"
            />
          </>
        );
      }
      
      if (selectedNode.data.label.includes('tags')) {
        return (
          <TextField
            label="Tags (comma-separated)"
            value={Array.isArray(localConfig.tags) ? localConfig.tags.join(', ') : ''}
            onChange={(value) => handleConfigChange('tags', value.split(',').map(t => t.trim()))}
            autoComplete="off"
          />
        );
      }
      
      if (selectedNode.data.label.includes('line item')) {
        return (
          <>
            <TextField
              label="Product ID"
              value={String(localConfig.product_id || '')}
              onChange={(value) => handleConfigChange('product_id', value)}
              autoComplete="off"
            />
            <TextField
              label="Quantity"
              type="number"
              value={String(localConfig.quantity || 1)}
              onChange={(value) => handleConfigChange('quantity', parseInt(value) || 1)}
              autoComplete="off"
            />
          </>
        );
      }
    }
    
    return null;
  };
  
  return (
    <div style={{ width: '360px', height: '100%', borderLeft: '1px solid #e1e3e5', overflowY: 'auto' }}>
      <div style={{ padding: '16px' }}>
        <BlockStack gap="400">
          <InlineStack align="space-between" blockAlign="center">
            <Text as="h2" variant="headingLg">
              Properties
            </Text>
            <Badge tone="info">{selectedNode.data.type}</Badge>
          </InlineStack>
          
          <Card>
            <BlockStack gap="400">
              <FormLayout>
                <TextField
                  label="Label"
                  value={selectedNode.data.label}
                  onChange={handleLabelChange}
                  autoComplete="off"
                />
                <TextField
                  label="Description"
                  value={selectedNode.data.description || ''}
                  onChange={handleDescriptionChange}
                  multiline={2}
                  autoComplete="off"
                />
                
                {selectedNode.data.type === 'condition' && (
                  <>
                    <Divider />
                    <BlockStack gap="300">
                      <InlineStack align="space-between" blockAlign="center">
                        <Text as="h3" variant="headingMd">
                          Conditions
                        </Text>
                        <Button
                          icon={Icons.Add}
                          onClick={addCondition}
                          size="slim"
                        >
                          Add
                        </Button>
                      </InlineStack>
                      
                      {conditions.map((condition, index) => (
                        <Card key={condition.id} padding="200">
                          <BlockStack gap="200">
                            {index > 0 && (
                              <Select
                                label="Operator"
                                labelHidden
                                options={[
                                  { label: 'AND', value: 'AND' },
                                  { label: 'OR', value: 'OR' }
                                ]}
                                value={condition.logicalOperator || 'AND'}
                                onChange={(value) => updateCondition(condition.id, { 
                                  logicalOperator: value as 'AND' | 'OR' 
                                })}
                              />
                            )}
                            <TextField
                              label="Field"
                              labelHidden
                              placeholder="Field name"
                              value={condition.field}
                              onChange={(value) => updateCondition(condition.id, { field: value })}
                              autoComplete="off"
                            />
                            <Select
                              label="Operator"
                              labelHidden
                              options={[
                                { label: 'Equals', value: 'equals' },
                                { label: 'Not equals', value: 'not_equals' },
                                { label: 'Contains', value: 'contains' },
                                { label: 'Empty', value: 'empty' },
                                { label: 'Not empty', value: 'not_empty' }
                              ]}
                              value={condition.operator}
                              onChange={(value) => updateCondition(condition.id, { 
                                operator: value as WorkflowCondition['operator'] 
                              })}
                            />
                            {!['empty', 'not_empty'].includes(condition.operator) && (
                              <TextField
                                label="Value"
                                labelHidden
                                placeholder="Value"
                                value={condition.value}
                                onChange={(value) => updateCondition(condition.id, { value })}
                                autoComplete="off"
                              />
                            )}
                            <Button
                              icon={Icons.Delete}
                              onClick={() => removeCondition(condition.id)}
                              variant="plain"
                              tone="critical"
                              size="slim"
                            />
                          </BlockStack>
                        </Card>
                      ))}
                    </BlockStack>
                  </>
                )}
                
                {renderConfigFields()}
              </FormLayout>
              
              <Divider />
              
              <Button
                tone="critical"
                icon={Icons.Delete}
                onClick={() => deleteNode(selectedNode.id)}
                fullWidth
              >
                Delete Node
              </Button>
            </BlockStack>
          </Card>
        </BlockStack>
      </div>
    </div>
  );
};

export default PropertiesSidebar;