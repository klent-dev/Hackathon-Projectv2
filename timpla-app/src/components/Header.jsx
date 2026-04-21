import React from 'react';

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
    </header>
  );
}
