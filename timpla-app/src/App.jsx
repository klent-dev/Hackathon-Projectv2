import { useState } from 'react';
import Header from './components/Header';
import LocationPicker from './components/LocationPicker';
import SavingsCard from './components/SavingsCard';
import RouteCard from './components/RouteCard';
import { calculateSavings, findRoutes } from './engine/routeFinder';
import './App.css';

function App() {
  const [routeOptions, setRouteOptions] = useState([]);
  const [savingsInfo, setSavingsInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [calculationDone, setCalculationDone] = useState(false);

  const handleCalculate = (from, to) => {
    if (!from || !to) return;

    setIsLoading(true);
    setRouteOptions([]);
    setSavingsInfo(null);
    setCalculationDone(false);

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

  return (
    <div className="app-container">
      <Header />
      <main>
        <LocationPicker onCalculate={handleCalculate} />

        {isLoading && <div className="loader">Calculating your best route...</div>}

        {!isLoading && calculationDone && (
          <div className="results">
            {savingsInfo && <SavingsCard info={savingsInfo} />}
            {routeOptions.length > 0 ? (
              routeOptions.map((route, index) => (
                <RouteCard key={route.id} route={route} isCheapest={index === 0} />
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
