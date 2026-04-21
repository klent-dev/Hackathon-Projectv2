import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { NODES } from '../data/routes';
import { NODE_COORDINATES, DEFAULT_MAP_CENTER } from '../data/routeLocations';
import LocationPicker from './LocationPicker';
import './RouteJourneyPage.css';
import './RouteCard.css';
import './SavingsCard.css';

const ICONS = {
  car: "🚗",
  "car-alt": "🚙",
};

// Fix leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Quick util to inverse OSRM geojson [lon, lat] format back to Leaflet [lat, lon]
function mapOsrmGeometryToLeaflet(coordinates) {
  return coordinates.map(([lon, lat]) => [lat, lon]);
}

const createTextIcon = (text, color) => {
  return L.divIcon({
    className: 'custom-text-icon',
    html: `<div style="background-color: ${color}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); font-size: 14px;">${text}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

function FitMapBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions && positions.length > 1) {
      map.fitBounds(L.latLngBounds(positions), { padding: [36, 36], animate: false });
    }
  }, [map, positions]);
  return null;
}

function DriverJourneyPage({ route, onBackToResults }) {
  const startNode = route.rawNodes.start;
  const endNode = route.rawNodes.end;

  return (
    <div className="journey-page">
      <div className="journey-header">
        <button className="back-btn" onClick={onBackToResults}>
          ← Back to driver routes
        </button>
        <div className="journey-title">
          <h2>Driving Route</h2>
          <p>
            {NODES[startNode]?.name} to {NODES[endNode]?.name}
          </p>
        </div>
      </div>

      <div className="map-view" style={{ width: '100%', height: '600px', borderRadius: '16px', overflow: 'hidden' }}>
        <MapContainer center={DEFAULT_MAP_CENTER} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitMapBounds positions={route.geometry} />

          <Polyline
            positions={route.geometry}
            color={route.isRecommended ? "#10b981" : "#ef4444"}
            weight={6}
            opacity={0.9}
          />

          <Marker position={route.geometry[0]} icon={createTextIcon('S', '#10b981')}>
            <Popup>Start: {NODES[startNode]?.name}</Popup>
          </Marker>
          <Marker position={route.geometry[route.geometry.length - 1]} icon={createTextIcon('E', '#ef4444')}>
            <Popup>Destination: {NODES[endNode]?.name}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

export default function DriverDashboard() {
  const [activeView, setActiveView] = useState('search');
  const [isLoading, setIsLoading] = useState(false);
  const [routeOptions, setRouteOptions] = useState([]);
  const [savingsInfo, setSavingsInfo] = useState(null);
  const [selectedRouteId, setSelectedRouteId] = useState(null);

  const handleCalculateRoute = async (startNode, endNode) => {
    setActiveView('results');
    setIsLoading(true);
    setRouteOptions([]);
    setSavingsInfo(null);
    setSelectedRouteId(null);

    const fromCoords = NODE_COORDINATES[startNode];
    const toCoords = NODE_COORDINATES[endNode];

    if (!fromCoords || !toCoords) {
      setIsLoading(false);
      return;
    }

    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${fromCoords[1]},${fromCoords[0]};${toCoords[1]},${toCoords[0]}?alternatives=true&overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.code === 'Ok' && data.routes.length > 0) {
        let processedRoutes = data.routes.map((r, i) => {
          const distKm = r.distance / 1000;
          const durationMins = r.duration / 60;
          const fuelEst = (distKm * 0.08) + ((r.duration / 3600) * 1.5);

          return {
            id: `driver-route-${i}`,
            rawNodes: { start: startNode, end: endNode },
            isRecommended: false,
            label: "Alternative Path",
            distance: distKm.toFixed(1),
            duration: Math.round(durationMins),
            fuelLitres: fuelEst.toFixed(1),
            fuelRaw: fuelEst,
            geometry: mapOsrmGeometryToLeaflet(r.geometry.coordinates)
          };
        });

        processedRoutes.sort((a, b) => a.fuelRaw - b.fuelRaw);
        processedRoutes.forEach((route, idx) => {
           route.isRecommended = idx === 0;
           route.label = idx === 0 ? "Recommended Path" : "Alternative Path";
        });

        setRouteOptions(processedRoutes);
        
        if (processedRoutes.length > 1) {
            const recRoute = processedRoutes[0];
            const altRoute = processedRoutes[1];
            const timeSaved = Math.max(0, altRoute.duration - recRoute.duration);
            const fuelSaved = Math.max(0, altRoute.fuelRaw - recRoute.fuelRaw);
            
            setSavingsInfo({
              timeMins: timeSaved,
              fuelLitres: fuelSaved.toFixed(1),
              cashEst: Math.round(fuelSaved * 60),
              altFuel: altRoute.fuelLitres,
              recFuel: recRoute.fuelLitres
            });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNodesChange = () => {
    setRouteOptions([]);
    setSavingsInfo(null);
    setSelectedRouteId(null);
    setActiveView('search');
  };

  if (activeView === 'journey') {
    const selected = routeOptions.find((r) => r.id === selectedRouteId);
    return <DriverJourneyPage route={selected} onBackToResults={() => setActiveView('results')} />;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: '0.5rem' }}>
      {activeView === 'search' && (
        <LocationPicker 
           onCalculate={handleCalculateRoute} 
           onNodesChange={handleNodesChange}
           preferences={{ driverMode: true, priority: "cheapest", avoidWalking: true }}
        />
      )}

      {activeView === 'results' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Driver Route Results</h2>
          <button 
             onClick={() => setActiveView('search')}
             style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-color)', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer' }}
          >
            ← Change Locations
          </button>
        </div>
      )}

      {isLoading && <div className="loader" style={{ textAlign: "center", marginTop: "4rem", color: "var(--text-secondary)" }}>Calculating best driving route...</div>}

      {!isLoading && activeView === 'results' && (
        <div className="results mt-4">
          
          {savingsInfo && savingsInfo.fuelLitres > 0 && (
            <div className="savings-card" style={{ marginBottom: "2rem" }}>
                <div className="savings-header">
                <p>
                    You save <span className="savings-amount">₱{savingsInfo.cashEst}</span>
                </p>
                </div>
                <div className="savings-body">
                <div className="comparison">
                    <div className="option">
                    <span className="mode-label">Traffic Route</span>
                    <span className="fare">{savingsInfo.altFuel}L</span>
                    </div>
                    <div className="vs">vs</div>
                    <div className="option timpla">
                    <span className="mode-label">Timpla Drive</span>
                    <span className="fare">{savingsInfo.recFuel}L</span>
                    </div>
                </div>
                </div>
                <div className="savings-footer">
                That's ~₱{Math.round(savingsInfo.cashEst * 4)}/day if driven twice round-trip! (Saves {savingsInfo.timeMins} min travel time)
                </div>
            </div>
          )}

          {routeOptions.length > 0 ? routeOptions.map(route => (
            <div 
               key={route.id} 
               className={`route-card ${route.isRecommended ? 'cheapest' : ''} ${selectedRouteId === route.id ? 'selected' : ''}`}
               onClick={() => setSelectedRouteId(route.id)}
               style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column' }}
            >
              <div className="card-main">
                <div className="card-left">
                  <div className="mode-sequence" style={{ fontSize: "1.5rem" }}>
                     <span className="mode-icon" title="Drive">{route.isRecommended ? ICONS["car"] : ICONS["car-alt"]}</span>
                  </div>
                  <div className="time-estimate">~{route.duration} min</div>
                  <div className="route-metrics">
                     Distance: {route.distance} km • Fuel: {route.fuelLitres} Litres
                  </div>
                  <div className="route-metrics">
                     {route.label}
                  </div>
                </div>
                <div className="card-right">
                  <div className="total-fare" style={{ fontSize: "2rem" }}>
                    <span style={{ fontSize: "1.2rem", marginRight: "0.2rem" }}>🔥</span>
                    {route.fuelLitres}L
                  </div>
                  {route.isRecommended && <div className="cheapest-badge" style={{ backgroundColor: "var(--accent-green)", marginBottom: "0.5rem" }}>BEST PATH</div>}
                  {(!route.isRecommended) && <div className="cheapest-badge" style={{ backgroundColor: "var(--accent-red)", marginBottom: "0.5rem", color: "white" }}>CONGESTED</div>}
                  <br />
                  <button
                    type="button"
                    className="take-route-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveView('journey');
                      setSelectedRouteId(route.id);
                    }}
                  >
                    Drive this route
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="results-placeholder" style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
               No alternate driving routes found. Try another path.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
