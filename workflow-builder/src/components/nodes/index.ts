import TriggerNode from './TriggerNode';
import ConditionNode from './ConditionNode';
import ActionNode from './ActionNode';
import StepNode from './StepNode';

export const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
  step: StepNode,
};

export { TriggerNode, ConditionNode, ActionNode, StepNode };