import React from 'react';

<<<<<<< HEAD
function Header({ onHomeClick }) {
  return (
    <header className="app-header" onClick={onHomeClick} style={{ cursor: onHomeClick ? 'pointer' : 'default' }}>
      <h1 className="app-title">
        Timpla
        <span className="app-logo" role="img" aria-label="bowl">
          🥣
        </span>
      </h1>
      <p className="app-tagline">Mix your ride. Save your money.</p>
=======
export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <span className="header-emoji">🥣</span>
          <div>
            <h1 className="header-title">Timpla</h1>
            <p className="header-tagline">Mix your ride. Save your money.</p>
          </div>
        </div>
        <div className="header-badge">
          <span className="badge-text">SUGBO-SAVE 2026</span>
        </div>
      </div>
>>>>>>> 1b94f886d86d9a06d6fbd51ea3d07bfd69cff4cb
    </header>
  );
}
