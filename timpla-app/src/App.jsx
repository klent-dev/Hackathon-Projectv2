import React, { useState } from 'react';
import Header from './components/Header.jsx';
import LocationPicker from './components/LocationPicker.jsx';
import RouteCard from './components/RouteCard.jsx';
import SavingsCard from './components/SavingsCard.jsx';
import { findRoutes, getExpensiveBaseline } from './engine/routeFinder.js';
import { getLocationName } from './data/routes.js';

export default function App() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [routes, setRoutes] = useState([]);
  const [baseline, setBaseline] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleCalculate = () => {
    setIsLoading(true);
    setHasSearched(false);

    // Small delay to show loading state and trigger animations
    setTimeout(() => {
      const results = findRoutes(origin, destination, 4);
      const expensiveBaseline = getExpensiveBaseline(origin, destination);
      setRoutes(results);
      setBaseline(expensiveBaseline);
      setIsLoading(false);
      setHasSearched(true);

      // Scroll to results
      setTimeout(() => {
        const el = document.getElementById('results-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 600);
  };

  return (
    <div className="app">
      {/* Animated Background */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <Header />

      <main className="main-content">
        <LocationPicker
          origin={origin}
          destination={destination}
          onOriginChange={setOrigin}
          onDestChange={setDestination}
          onCalculate={handleCalculate}
          isLoading={isLoading}
        />

        {hasSearched && (
          <section className="results-section" id="results-section">
            {routes.length > 0 ? (
              <>
                <div className="results-header">
                  <h2 className="results-title">
                    <span className="results-emoji">🗺️</span>
                    Routes: {getLocationName(origin)} → {getLocationName(destination)}
                  </h2>
                  <p className="results-subtitle">
                    Found {routes.length} mixed routes. Tap a card for step-by-step directions.
                  </p>
                </div>

                <div className="route-cards-list">
                  {routes.map((route, i) => (
                    <RouteCard
                      key={i}
                      route={route}
                      index={i}
                      isCheapest={i === 0}
                    />
                  ))}
                </div>

                {baseline && routes.length > 0 && (
                  <SavingsCard
                    cheapestFare={routes[0].totalFare}
                    baselineFare={baseline.fare}
                    baselineLabel={baseline.label}
                  />
                )}
              </>
            ) : (
              <div className="no-results">
                <span className="no-results-emoji">😕</span>
                <h3>No routes found</h3>
                <p>Try a different origin or destination.</p>
              </div>
            )}
          </section>
        )}

        {!hasSearched && !isLoading && (
          <section className="hero-section">
            <div className="hero-card">
              <h2 className="hero-title">Stop overpaying for your commute! 🚐</h2>
              <p className="hero-text">
                Most Cebu commuters default to one expensive ride. Timpla finds cheaper
                <strong> mixed routes</strong> combining jeepneys, walks, and buses — saving you
                <strong> ₱50-200 per trip</strong>.
              </p>
              <div className="hero-example">
                <div className="example-bad">
                  <span className="example-label">❌ Usual way</span>
                  <span className="example-route">Grab from IT Park → Mactan</span>
                  <span className="example-fare bad-fare">₱350</span>
                </div>
                <div className="example-arrow">→</div>
                <div className="example-good">
                  <span className="example-label">✅ Timpla way</span>
                  <span className="example-route">Jeep + Jeep + Jeep</span>
                  <span className="example-fare good-fare">₱46</span>
                </div>
              </div>
              <div className="hero-stats">
                <div className="hero-stat">
                  <span className="stat-number">17</span>
                  <span className="stat-label">Cebu Locations</span>
                </div>
                <div className="hero-stat">
                  <span className="stat-number">8</span>
                  <span className="stat-label">Transport Modes</span>
                </div>
                <div className="hero-stat">
                  <span className="stat-number">₱0</span>
                  <span className="stat-label">App Cost</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>Built with 💚 for SUGBO-SAVE 2026 Hackathon · USJR</p>
        <p className="footer-sub">Diskarte — Using EXISTING resources, not new infrastructure.</p>
      </footer>
    </div>
  );
}
