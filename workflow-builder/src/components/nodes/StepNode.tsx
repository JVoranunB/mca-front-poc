import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Card, Text, InlineStack, BlockStack, Icon } from '@shopify/polaris';
import { Icons } from '../../utils/icons';
import type { NodeData } from '../../types/workflow.types';

const StepNode = memo(({ data }: NodeProps) => {
  const nodeData = data as NodeData;
  return (
    <div style={{ minWidth: '200px' }}>
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: '#6C71C5',
          width: 10,
          height: 10,
          border: '2px solid #fff',
          top: -5
        }}
      />
      
      <Card padding="300">
        <BlockStack gap="200">
          <InlineStack gap="200" blockAlign="center">
            <div style={{ 
              background: '#6C71C5', 
              borderRadius: '4px', 
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Icon source={Icons.Step} tone="base" />
            </div>
            <Text as="h3" variant="headingMd" fontWeight="semibold">
              Step
            </Text>
          </InlineStack>
          
          <Text as="p" variant="bodyMd" fontWeight="medium">
            {nodeData.label}
          </Text>
          
          {nodeData.description && (
            <Text as="p" variant="bodySm" tone="subdued">
              {nodeData.description}
            </Text>
          )}
        </BlockStack>
      </Card>
      
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: '#6C71C5',
          width: 10,
          height: 10,
          border: '2px solid #fff',
          bottom: -5
        }}
      />
    </div>
  );
});

StepNode.displayName = 'StepNode';

export default StepNode;