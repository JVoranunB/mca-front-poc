import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Card, Text, InlineStack, BlockStack, Icon } from '@shopify/polaris';
import { Icons } from '../../utils/icons';
import type { NodeData, StartConfig } from '../../types/workflow.types';

const StartNode = memo(({ data }: NodeProps) => {
  const nodeData = data as NodeData;
  const startConfig = nodeData.config as StartConfig;
  
  return (
    <div style={{ minWidth: '280px' }} data-node-type="start">
      <Card padding="300">
        <BlockStack gap="200">
          <InlineStack align="space-between" blockAlign="center">
            <InlineStack gap="200" blockAlign="center">
              <div className="node-icon-container">
                <Icon 
                  source={Icons.Trigger} 
                  tone="base" 
                />
              </div>
              <Text as="h3" variant="headingMd" fontWeight="semibold">
                Start
              </Text>
            </InlineStack>
          </InlineStack>
          
          <BlockStack gap="100">
            <Text as="p" variant="bodyMd" fontWeight="medium">
              {startConfig?.label || 'Workflow Start'}
            </Text>
            {startConfig?.description && (
              <Text as="p" variant="bodySm" tone="subdued">
                {startConfig.description}
              </Text>
            )}
            <Text as="p" variant="bodySm" tone="subdued">
              Data Source: {startConfig?.dataSource || 'CRM'}
            </Text>
            {startConfig?.merchantId && (
              <Text as="p" variant="bodySm" tone="subdued">
                Merchant: {startConfig.merchantId}
              </Text>
            )}
          </BlockStack>
        </BlockStack>
      </Card>
      
      {/* Output handle on the right */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          right: -5
        }}
      />
    </div>
  );
});

StartNode.displayName = 'StartNode';

export default StartNode;