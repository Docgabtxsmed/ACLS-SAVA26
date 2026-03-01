import { useNavigate } from 'react-router-dom';
import './Navbar.css';

interface NavbarProps {
  title?: string;
  showBack?: boolean;
}

export default function Navbar({ title, showBack = false }: NavbarProps) {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        {showBack ? (
          <button className="navbar-back" onClick={() => navigate('/')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>Início</span>
          </button>
        ) : (
          <div className="navbar-logo">
            <span className="navbar-heart">❤️</span>
            <span className="navbar-brand">SAVA e ACLS</span>
          </div>
        )}
        {title && <h1 className="navbar-title">{title}</h1>}
        <div className="navbar-badge">
          <span>Algoritmos Interativos</span>
        </div>
      </div>
    </nav>
  );
}
