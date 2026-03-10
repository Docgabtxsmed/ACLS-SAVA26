import { useNavigate } from 'react-router-dom';
import { AlgorithmData } from '../types';
import './AlgorithmCard.css';

interface AlgorithmCardProps {
  algorithm: AlgorithmData;
  index: number;
}

export default function AlgorithmCard({ algorithm, index }: AlgorithmCardProps) {
  const navigate = useNavigate();

  return (
    <article
      className={`algo-card animate-fade-in-up delay-${index + 1}`}
      style={{ '--card-accent': algorithm.color } as React.CSSProperties}
      onClick={() => navigate(algorithm.path)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(algorithm.path)}
    >
      <div className="algo-card-glow" />
      <div className="algo-card-header">
        <span className="algo-card-icon">{algorithm.icon}</span>
      </div>
      <h2 className="algo-card-title">{algorithm.title}</h2>
      <p className="algo-card-subtitle">{algorithm.subtitle}</p>
      {algorithm.tema && (
        <span className="algo-card-tema">{algorithm.tema}</span>
      )}
      <p className="algo-card-desc">{algorithm.description}</p>
      {algorithm.referencias && algorithm.referencias.length > 0 && (
        <div className="algo-card-refs">
          {algorithm.referencias.map((ref) => (
            <span key={ref} className="algo-card-ref-tag">{ref}</span>
          ))}
        </div>
      )}
      <div className="algo-card-footer">
        <span className="algo-card-cta">
          Ver Algoritmo
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>
      </div>
    </article>
  );
}
