import './DosePanel.css';

interface DosePanelProps {
  title: string;
  items: { label: string; detail: string }[];
  accentColor?: string;
}

export default function DosePanel({ title, items, accentColor }: DosePanelProps) {
  return (
    <div className="dose-panel" style={accentColor ? { '--dose-accent': accentColor } as React.CSSProperties : undefined}>
      <h3 className="dose-panel-title">{title}</h3>
      <div className="dose-panel-items">
        {items.map((item, i) => (
          <div key={i} className="dose-item">
            <span className="dose-item-label">{item.label}</span>
            <span className="dose-item-detail">{item.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
