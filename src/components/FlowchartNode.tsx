import { useState } from 'react';
import { NodeType } from '../types';
import './FlowchartNode.css';

interface FlowchartNodeProps {
  type: NodeType;
  title: string;
  items?: string[];
  stepNumber?: number;
  expanded?: boolean;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export default function FlowchartNode({
  type,
  title,
  items,
  stepNumber,
  expanded: controlledExpanded,
  onClick,
  className = '',
  children,
}: FlowchartNodeProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const expanded = controlledExpanded ?? internalExpanded;
  const hasDetails = (items && items.length > 0) || children;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (hasDetails) {
      setInternalExpanded(!internalExpanded);
    }
  };

  return (
    <div
      className={`flow-node flow-node--${type} ${expanded ? 'flow-node--expanded' : ''} ${hasDetails ? 'flow-node--clickable' : ''} ${className}`}
      onClick={handleClick}
      role={hasDetails ? 'button' : undefined}
      tabIndex={hasDetails ? 0 : undefined}
      onKeyDown={(e) => hasDetails && e.key === 'Enter' && handleClick()}
    >
      {stepNumber !== undefined && (
        <span className="flow-node-step">{stepNumber}</span>
      )}
      <div className="flow-node-content">
        <h3 className="flow-node-title">{title}</h3>
        {expanded && items && items.length > 0 && (
          <ul className="flow-node-items">
            {items.map((item, i) => (
              <li key={i} className="flow-node-item">• {item}</li>
            ))}
          </ul>
        )}
        {expanded && children && (
          <div className="flow-node-children">{children}</div>
        )}
        {hasDetails && (
          <span className="flow-node-toggle">
            {expanded ? '▲ Menos' : '▼ Detalhes'}
          </span>
        )}
      </div>
    </div>
  );
}
