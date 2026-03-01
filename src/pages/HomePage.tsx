import Navbar from '../components/Navbar';
import AlgorithmCard from '../components/AlgorithmCard';
import { algorithms, savaTopics } from '../data/algorithms';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home-page">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-pattern" />
        <div className="container hero-content">
          <div className="hero-heart animate-fade-in-up">❤️</div>
          <h1 className="hero-title animate-fade-in-up delay-1">
            ACLS
            <span className="hero-title-sub">Advanced Cardiac Life Support</span>
          </h1>
          <p className="hero-desc animate-fade-in-up delay-2">
            Interactive algorithms and flowcharts for emergency cardiac care protocols.
            Click on any algorithm below to explore the step-by-step workflow.
          </p>
          <div className="hero-stats animate-fade-in-up delay-3">
            <div className="hero-stat">
              <span className="hero-stat-num">12</span>
              <span className="hero-stat-label">Algorithms</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">2025</span>
              <span className="hero-stat-label">AHA Guidelines</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">∞</span>
              <span className="hero-stat-label">Interactive</span>
            </div>
          </div>
        </div>
      </section>

      {/* Algorithms Grid */}
      <section className="algorithms-section">
        <div className="container">
          <h2 className="section-heading">
            <span className="section-heading-line" />
            Choose an Algorithm
            <span className="section-heading-line" />
          </h2>
          <div className="algorithms-grid">
            {algorithms.map((algo, i) => (
              <AlgorithmCard key={algo.id} algorithm={algo} index={i} />
            ))}
          </div>

          <h2 className="section-heading" style={{ marginTop: 'var(--space-3xl)' }}>
            <span className="section-heading-line" />
            SAVA — Temas Especiais
            <span className="section-heading-line" />
          </h2>
          <div className="algorithms-grid">
            {savaTopics.map((algo, i) => (
              <AlgorithmCard key={algo.id} algorithm={algo} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="container">
          <p>Based on the NHCPS ACLS Handbook — 2025 AHA Guidelines</p>
          <p className="home-footer-sub">For educational purposes only. Not a substitute for professional training.</p>
        </div>
      </footer>
    </div>
  );
}
