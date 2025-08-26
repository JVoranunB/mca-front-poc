import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Card, Text, Badge, InlineStack, BlockStack, Icon, Divider } from '@shopify/polaris';
import { Icons } from '../../utils/icons';
import type { NodeData } from '../../types/workflow.types';

const ConditionNode = memo(({ data }: NodeProps) => {
  const nodeData = data as NodeData;
  return (
    <div style={{ minWidth: '320px' }}>
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: '#95A99C',
          width: 10,
          height: 10,
          border: '2px solid #fff',
          top: -5
        }}
      />
      
      <Card padding="300">
        <BlockStack gap="200">
          <InlineStack align="space-between" blockAlign="center">
            <InlineStack gap="200" blockAlign="center">
              <div style={{ 
                background: '#95A99C', 
                borderRadius: '4px', 
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon source={Icons.Condition} tone="base" />
              </div>
              <Text as="h3" variant="headingMd" fontWeight="semibold">
                Check if...
              </Text>
            </InlineStack>
            {nodeData.status === 'review' && (
              <Badge tone="attention">Review</Badge>
            )}
          </InlineStack>
          
          <Text as="p" variant="bodyMd" fontWeight="medium">
            {nodeData.label}
          </Text>
          
          {nodeData.conditions && nodeData.conditions.length > 0 && (
            <BlockStack gap="150">
              <Divider />
              {nodeData.conditions.map((condition, index: number) => (
                <BlockStack key={condition.id} gap="100">
                  {index > 0 && condition.logicalOperator && (
                    <Badge tone="info">{condition.logicalOperator}</Badge>
                  )}
                  <InlineStack gap="100" wrap={false}>
                    <Text as="span" variant="bodySm">
                      {condition.field}
                    </Text>
                    <Badge size="small">
                      {condition.operator.replace('_', ' ')}
                    </Badge>
                    {condition.value && (
                      <Text as="span" variant="bodySm" fontWeight="medium">
                        {condition.value}
                      </Text>
                    )}
                  </InlineStack>
                </BlockStack>
              ))}
            </BlockStack>
          )}
        </BlockStack>
      </Card>
      
      <Handle
        id="then"
        type="source"
        position={Position.Bottom}
        style={{
          background: '#50B83C',
          width: 10,
          height: 10,
          border: '2px solid #fff',
          bottom: -5,
          left: '30%'
        }}
      />
      <div style={{
        position: 'absolute',
        bottom: -20,
        left: '30%',
        transform: 'translateX(-50%)',
        fontSize: '11px',
        color: '#50B83C',
        fontWeight: 500
      }}>
        Then
      </div>
      
      <Handle
        id="otherwise"
        type="source"
        position={Position.Bottom}
        style={{
          background: '#F49342',
          width: 10,
          height: 10,
          border: '2px solid #fff',
          bottom: -5,
          left: '70%'
        }}
      />
      <div style={{
        position: 'absolute',
        bottom: -20,
        left: '70%',
        transform: 'translateX(-50%)',
        fontSize: '11px',
        color: '#F49342',
        fontWeight: 500
      }}>
        Otherwise
      </div>
    </div>
  );
});

ConditionNode.displayName = 'ConditionNode';

export default ConditionNode;