import { ArrhythmiaData } from '../data/arrhythmiaData';
import './ArrhythmiaCard.css';

interface ArrhythmiaCardProps {
  arrhythmia: ArrhythmiaData;
  onClick: () => void;
  index: number;
}

export default function ArrhythmiaCardComponent({ arrhythmia, onClick, index }: ArrhythmiaCardProps) {
  const categoryLabels: Record<string, string> = {
    'narrow-regular': 'QRS Estreito • Regular',
    'narrow-irregular': 'QRS Estreito • Irregular',
    'wide-regular': 'QRS Largo • Regular',
    'wide-irregular': 'QRS Largo • Irregular',
  };

  return (
    <article
      className={`arrhy-card animate-fade-in-up delay-${(index % 6) + 1}`}
      style={{ '--arrhy-accent': arrhythmia.color } as React.CSSProperties}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="arrhy-card-glow" />
      <span className="arrhy-card-icon">{arrhythmia.icon}</span>
      <h3 className="arrhy-card-name">{arrhythmia.name}</h3>
      {arrhythmia.abbreviation && (
        <span className="arrhy-card-abbr">{arrhythmia.abbreviation}</span>
      )}
      <span className="arrhy-card-category">{categoryLabels[arrhythmia.category]}</span>
      <span className="arrhy-card-cta">
        Ver detalhes
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </span>
    </article>
  );
}
