import React from "react";
import "./Header.css";

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
    </header>
  );
}

export default Header;
