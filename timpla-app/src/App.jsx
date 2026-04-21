import { useEffect, useState } from 'react';
import Header from './components/Header';
import LocationPicker from './components/LocationPicker';
import SavingsCard from './components/SavingsCard';
import RouteCard from './components/RouteCard';
import RouteJourneyPage from './components/RouteJourneyPage';
import { calculateSavings, findRoutes } from './engine/routeFinder';
import './App.css';

const APP_STATE_KEY = 'timpla-app-route-state';

function readStoredAppState() {
  try {
    const stored = sessionStorage.getItem(APP_STATE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function App() {
  const storedState = readStoredAppState();
  const [routeOptions, setRouteOptions] = useState(storedState?.routeOptions || []);
  const [savingsInfo, setSavingsInfo] = useState(storedState?.savingsInfo || null);
  const [isLoading, setIsLoading] = useState(false);
  const [calculationDone, setCalculationDone] = useState(Boolean(storedState?.calculationDone));
  const [selectedRouteId, setSelectedRouteId] = useState(storedState?.selectedRouteId || null);
  const [activeView, setActiveView] = useState(storedState?.activeView || 'search');

  useEffect(() => {
    try {
      const snapshot = {
        routeOptions,
        savingsInfo,
        calculationDone,
        selectedRouteId,
        activeView,
      };

      if (calculationDone || activeView !== 'search') {
        sessionStorage.setItem(APP_STATE_KEY, JSON.stringify(snapshot));
      } else {
        sessionStorage.removeItem(APP_STATE_KEY);
      }
    } catch {
      // Ignore storage failures.
    }
  }, [routeOptions, savingsInfo, calculationDone, selectedRouteId, activeView]);

  const handleCalculate = (from, to) => {
    if (!from || !to) return;

    setIsLoading(true);
    setRouteOptions([]);
    setSavingsInfo(null);
    setCalculationDone(false);
    setSelectedRouteId(null);
    setActiveView('results');

    // Simulate network delay
    setTimeout(() => {
      try {
        const routes = findRoutes(from, to);
        const savings = calculateSavings(routes);
        setRouteOptions(routes);
        setSavingsInfo(savings);
      } finally {
        setIsLoading(false);
        setCalculationDone(true);
      }
    }, 1200);
  };

  const handleTakeRoute = (routeId) => {
    setSelectedRouteId(routeId);
    setActiveView('journey');
  };

  const handleBackToResults = () => {
    setActiveView('results');
  };

  const handleResetJourney = () => {
    setSelectedRouteId(null);
    setActiveView('results');
  };

  const selectedRoute = routeOptions.find((route) => route.id === selectedRouteId) || null;

  if (activeView === 'journey' && selectedRoute) {
    return (
      <div className="app-container">
        <Header />
        <main>
          <RouteJourneyPage route={selectedRoute} onBackToResults={handleResetJourney} />
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />
      <main>
        <LocationPicker onCalculate={handleCalculate} />

        {isLoading && <div className="loader">Calculating your best route...</div>}

        {!isLoading && calculationDone && (
          <div className="results">
            {savingsInfo && <SavingsCard info={savingsInfo} />}
            {selectedRoute && (
              <div className="selected-route-banner">
                <p>
                  Selected route: ₱{selectedRoute.totalFare} • ~{selectedRoute.totalTime} min
                </p>
              </div>
            )}
            {routeOptions.length > 0 ? (
              routeOptions.map((route, index) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  isCheapest={index === 0}
                  isSelected={route.id === selectedRouteId}
                  onTakeRoute={handleTakeRoute}
                />
              ))
            ) : (
              <div className="results-placeholder">
                <p>No routes found. Try another combination.</p>
              </div>
            )}
          </div>
        )}

        {!isLoading && !calculationDone && (
           <div className="results-placeholder">
                <p>Select your origin and destination to see the magic!</p>
            </div>
        )}
      </main>
    </div>
  );
}

export default App;
