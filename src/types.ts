export type NodeType =
  | "start"
  | "action"
  | "critical"
  | "decision"
  | "info"
  | "warning";

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
  direction?: "down" | "right" | "left";
}

export interface FlowchartBranch {
  label: string;
  nodes: FlowchartNodeData[];
}

export type GravidadeLevel =
  | "Extrema"
  | "Altíssima"
  | "Alta"
  | "Moderada"
  | "Manejo";

export interface AlgorithmData {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  color: string;
  path: string;
  description: string;
  caseNumber?: number;
  tema?: string;
  gravidade?: GravidadeLevel;
  referencias?: string[];
}

export interface DoseInfo {
  title: string;
  items: { label: string; detail: string }[];
}
