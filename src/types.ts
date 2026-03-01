export type NodeType = 'start' | 'action' | 'critical' | 'decision' | 'info' | 'warning';

export interface FlowchartNodeData {
  id: string;
  type: NodeType;
  title: string;
  items?: string[];
  stepNumber?: number;
  yesLabel?: string;
  noLabel?: string;
  timeLabel?: string;
}

export interface FlowchartConnection {
  from: string;
  to: string;
  label?: string;
  direction?: 'down' | 'right' | 'left';
}

export interface FlowchartBranch {
  label: string;
  nodes: FlowchartNodeData[];
}

export interface AlgorithmData {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  color: string;
  path: string;
  description: string;
  caseNumber?: number;
}

export interface DoseInfo {
  title: string;
  items: { label: string; detail: string }[];
}
