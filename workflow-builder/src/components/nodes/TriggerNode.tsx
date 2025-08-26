import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Card, Text, Badge, InlineStack, BlockStack, Icon } from '@shopify/polaris';
import { Icons } from '../../utils/icons';
import type { NodeData } from '../../types/workflow.types';

const TriggerNode = memo(({ data }: NodeProps) => {
  const nodeData = data as NodeData;
  return (
    <div style={{ minWidth: '280px' }}>
      <Card padding="300">
        <BlockStack gap="200">
          <InlineStack align="space-between" blockAlign="center">
            <InlineStack gap="200" blockAlign="center">
              <div style={{ 
                background: '#5C6AC4', 
                borderRadius: '4px', 
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon source={Icons.Trigger} tone="base" />
              </div>
              <Text as="h3" variant="headingMd" fontWeight="semibold">
                Start when...
              </Text>
            </InlineStack>
            {nodeData.status === 'review' && (
              <Badge tone="attention">Review</Badge>
            )}
          </InlineStack>
          
          <Text as="p" variant="bodyMd" fontWeight="medium">
            {nodeData.label}
          </Text>
          
          {nodeData.description && (
            <Text as="p" variant="bodySm" tone="subdued">
              {nodeData.description}
            </Text>
          )}
          
          {nodeData.config && Object.keys(nodeData.config).length > 0 && (
            <BlockStack gap="100">
              {Object.entries(nodeData.config).map(([key, value]) => (
                <InlineStack key={key} gap="100">
                  <Text as="span" variant="bodySm" tone="subdued">
                    {key}:
                  </Text>
                  <Text as="span" variant="bodySm">
                    {String(value)}
                  </Text>
                </InlineStack>
              ))}
            </BlockStack>
          )}
        </BlockStack>
      </Card>
      
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#5C6AC4',
          width: 10,
          height: 10,
          border: '2px solid #fff',
          right: -5
        }}
      />
    </div>
  );
});

TriggerNode.displayName = 'TriggerNode';

export default TriggerNode;