import { useEffect, useRef } from 'react';
import { BradyarrhythmiaData } from '../data/bradyarrhythmiaData';
import './ArrhythmiaCard.css';

interface BradyarrhythmiaModalProps {
  arrhythmia: BradyarrhythmiaData;
  onClose: () => void;
}

export default function BradyarrhythmiaModal({ arrhythmia, onClose }: BradyarrhythmiaModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="arrhythmia-modal-backdrop" onClick={handleBackdropClick}>
      <div
        className="arrhythmia-modal"
        ref={modalRef}
        style={{ '--modal-accent': arrhythmia.color } as React.CSSProperties}
        role="dialog"
        aria-modal="true"
        aria-label={arrhythmia.name}
      >
        {/* Header */}
        <div className="arrhythmia-modal-header">
          <div className="arrhythmia-modal-header-left">
            <span className="arrhythmia-modal-icon">{arrhythmia.icon}</span>
            <div>
              <h2 className="arrhythmia-modal-title">{arrhythmia.name}</h2>
              {arrhythmia.abbreviation && (
                <span className="arrhythmia-modal-abbr">{arrhythmia.abbreviation}</span>
              )}
            </div>
          </div>
          <button className="arrhythmia-modal-close" onClick={onClose} aria-label="Fechar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="arrhythmia-modal-body">
          {/* Description */}
          <p className="arrhythmia-modal-desc">{arrhythmia.description}</p>

          {/* ECG Image */}
          {arrhythmia.ecgImage && (
            <div className="arrhythmia-modal-ecg">
              <div className="arrhythmia-modal-ecg-label">
                <span className="arrhythmia-modal-section-icon">📈</span>
                Traçado ECG
              </div>
              <img
                src={arrhythmia.ecgImage}
                alt={`ECG - ${arrhythmia.name}`}
                className="arrhythmia-modal-ecg-img"
                loading="lazy"
              />
            </div>
          )}

          {/* ECG Findings */}
          <div className="arrhythmia-modal-section">
            <h3 className="arrhythmia-modal-section-title">
              <span className="arrhythmia-modal-section-icon">📋</span>
              Achados no ECG
            </h3>
            <ul className="arrhythmia-modal-list">
              {arrhythmia.ecgFindings.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Characteristics */}
          <div className="arrhythmia-modal-section">
            <h3 className="arrhythmia-modal-section-title">
              <span className="arrhythmia-modal-section-icon">🔍</span>
              Características
            </h3>
            <ul className="arrhythmia-modal-list">
              {arrhythmia.characteristics.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Treatment */}
          <div className="arrhythmia-modal-section arrhythmia-modal-section--treatment">
            <h3 className="arrhythmia-modal-section-title">
              <span className="arrhythmia-modal-section-icon">💊</span>
              Tratamento
            </h3>
            <ul className="arrhythmia-modal-list arrhythmia-modal-list--treatment">
              {arrhythmia.treatment.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
