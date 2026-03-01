import './FlowchartArrow.css';

interface FlowchartArrowProps {
  label?: string;
  direction?: 'down' | 'right' | 'left' | 'split';
  className?: string;
}

export default function FlowchartArrow({ label, direction = 'down', className = '' }: FlowchartArrowProps) {
  return (
    <div className={`flow-arrow flow-arrow--${direction} ${className}`}>
      <div className="flow-arrow-line" />
      {label && <span className="flow-arrow-label">{label}</span>}
      <div className="flow-arrow-head" />
    </div>
  );
}
