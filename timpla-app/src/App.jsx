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

    setIsLoading(true);
    setRouteOptions([]);
    setSavingsInfo(null);
    setCalculationDone(false);
    setSelectedRouteId(null);
    setActiveView('results');

    // Simulate network delay
    setTimeout(() => {
      try {
        const routes = findRoutes(from, to, preferences || routePreferences);
        const savings = calculateSavings(routes);
        setRouteOptions(routes);
        setSavingsInfo(savings);
      } finally {
        setIsLoading(false);
        setCalculationDone(true);
      }
    }, 1200);
  };

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
        <LocationPicker
          onCalculate={handleCalculate}
          onNodesChange={handleNodesChange}
          preferences={routePreferences}
          onPreferencesChange={setRoutePreferences}
        />

        {isLoading && <div className="loader">Calculating your best route...</div>}

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
