<<<<<<< HEAD
import { useEffect, useState } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import LocationPicker from './components/LocationPicker';
import SavingsCard from './components/SavingsCard';
import RouteCard from './components/RouteCard';
import RouteJourneyPage from './components/RouteJourneyPage';
import DriverDashboard from './components/DriverDashboard';
import { calculateSavings, findRoutes } from './engine/routeFinder';
import './App.css';
=======
import React, { useState } from 'react';
import Header from './components/Header.jsx';
import LocationPicker from './components/LocationPicker.jsx';
import RouteCard from './components/RouteCard.jsx';
import SavingsCard from './components/SavingsCard.jsx';
import { findRoutes, getExpensiveBaseline } from './engine/routeFinder.js';
import { getLocationName } from './data/routes.js';
>>>>>>> 1b94f886d86d9a06d6fbd51ea3d07bfd69cff4cb

export default function App() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [routes, setRoutes] = useState([]);
  const [baseline, setBaseline] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
<<<<<<< HEAD
  const [calculationDone, setCalculationDone] = useState(Boolean(storedState?.calculationDone));
  const [selectedRouteId, setSelectedRouteId] = useState(storedState?.selectedRouteId || null);
  const [activeView, setActiveView] = useState(storedState?.activeView || 'search');
  const [userRole, setUserRole] = useState(storedState?.userRole || null);
  const [routePreferences, setRoutePreferences] = useState(
    storedState?.routePreferences || { priority: 'cheapest', avoidWalking: false }
  );

  useEffect(() => {
    try {
      const snapshot = {
        routeOptions,
        savingsInfo,
        calculationDone,
        selectedRouteId,
        activeView,
        userRole,
        routePreferences,
      };

      if (userRole || calculationDone || activeView !== 'search') {
        sessionStorage.setItem(APP_STATE_KEY, JSON.stringify(snapshot));
      } else {
        sessionStorage.removeItem(APP_STATE_KEY);
      }
    } catch {
      // Ignore storage failures.
    }
  }, [routeOptions, savingsInfo, calculationDone, selectedRouteId, activeView, userRole, routePreferences]);

  const handleSelectRole = (role) => {
    setUserRole(role);
    setActiveView('search');
  };

  const handleBackToRolePicker = () => {
    setUserRole(null);
    setSelectedRouteId(null);
    setRouteOptions([]);
    setSavingsInfo(null);
    setCalculationDone(false);
    setActiveView('search');
  };

  const handleCalculate = (from, to, preferences) => {
    if (!from || !to) return;

    if (preferences) {
      setRoutePreferences(preferences);
    }
=======
  const [hasSearched, setHasSearched] = useState(false);
>>>>>>> 1b94f886d86d9a06d6fbd51ea3d07bfd69cff4cb

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

<<<<<<< HEAD
  const [expandedRouteId, setExpandedRouteId] = useState(null);

  const handleTakeRoute = (routeId) => {
    setSelectedRouteId(routeId);
    setActiveView('journey');
  };

  const handleToggleExpand = (routeId) => {
    setExpandedRouteId((prev) => (prev === routeId ? null : routeId));
  };

  const handleBackToResults = () => {
    setActiveView('results');
  };

  const handleResetJourney = () => {
    setSelectedRouteId(null);
    setActiveView('results');
  };

  const handleNodesChange = () => {
    setRouteOptions([]);
    setSavingsInfo(null);
    setCalculationDone(false);
    setSelectedRouteId(null);
    setExpandedRouteId(null);
    setActiveView('search');
  };

  const selectedRoute = routeOptions.find((route) => route.id === selectedRouteId) || null;
  const cheapestRouteId =
    routeOptions.reduce((bestRoute, route) => {
      if (!bestRoute) return route;
      return route.totalFare < bestRoute.totalFare ? route : bestRoute;
    }, null)?.id || null;

  if (!userRole) {
    return (
      <div className="app-container">
        <Header onHomeClick={handleBackToRolePicker} />
        <main>
          <HomePage onSelectRole={handleSelectRole} />
        </main>
      </div>
    );
  }

  if (userRole === 'driver') {
    return (
      <div className="app-container">
        <Header onHomeClick={handleBackToRolePicker} />
        <main style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <DriverDashboard />
        </main>
      </div>
    );
  }

  if (activeView === 'journey' && selectedRoute) {
    return (
      <div className="app-container">
        <Header onHomeClick={handleBackToRolePicker} />
        <main>
          <RouteJourneyPage route={selectedRoute} onBackToResults={handleResetJourney} />
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header onHomeClick={handleBackToRolePicker} />
      <main>
=======
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
>>>>>>> 1b94f886d86d9a06d6fbd51ea3d07bfd69cff4cb
        <LocationPicker
          origin={origin}
          destination={destination}
          onOriginChange={setOrigin}
          onDestChange={setDestination}
          onCalculate={handleCalculate}
<<<<<<< HEAD
          onNodesChange={handleNodesChange}
          preferences={routePreferences}
          onPreferencesChange={setRoutePreferences}
=======
          isLoading={isLoading}
>>>>>>> 1b94f886d86d9a06d6fbd51ea3d07bfd69cff4cb
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

<<<<<<< HEAD
        {!isLoading && calculationDone && (
          <div className="results">
            {savingsInfo && <SavingsCard info={savingsInfo} />}
            {selectedRoute && (
              <div className="selected-route-banner">
                <p>
                  Selected route: ₱
                  {typeof selectedRoute.totalFareMin === 'number' && typeof selectedRoute.totalFareMax === 'number'
                    ? selectedRoute.totalFareMin === selectedRoute.totalFareMax
                      ? selectedRoute.totalFareMin
                      : `${selectedRoute.totalFareMin}-${selectedRoute.totalFareMax}`
                    : selectedRoute.totalFare} • ~{selectedRoute.totalTime} min
                </p>
              </div>
            )}
            {routeOptions.length > 0 ? (
              routeOptions.map((route, index) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  isCheapest={route.id === cheapestRouteId}
                  isSelected={route.id === selectedRouteId}
                  isExpanded={expandedRouteId === route.id}
                  onToggleExpand={handleToggleExpand}
                  onTakeRoute={handleTakeRoute}
                />
              ))
=======
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
>>>>>>> 1b94f886d86d9a06d6fbd51ea3d07bfd69cff4cb
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
