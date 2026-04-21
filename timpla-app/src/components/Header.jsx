import React from "react";
import "./Header.css";

function Header() {
  return (
    <header className="app-header">
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
