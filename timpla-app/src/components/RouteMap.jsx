import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getLocation } from '../data/routes';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons for start and end
const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const endIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to automatically adjust map bounds to fit the route
function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [map, positions]);
  return null;
}

export default function RouteMap({ route }) {
  // Extract all points along the route
  const points = [getLocation(route.segments[0].from)];
  route.segments.forEach(step => {
    points.push(getLocation(step.to));
  });

  const positions = points.map(p => [p.lat, p.lng]);
  const start = points[0];
  const end = points[points.length - 1];

  // Colors for different modes
  const getModeColor = (mode) => {
    switch(mode) {
      case 'jeepney': return '#f59e0b';
      case 'bus': return '#3b82f6';
      case 'mybus': return '#06b6d4';
      case 'walk': return '#10b981';
      case 'grab': return '#f97316';
      default: return '#8b5cf6';
    }
  };

  return (
    <div className="map-wrapper">
      <MapContainer 
        center={positions[0]} 
        zoom={13} 
        scrollWheelZoom={true} 
        zoomControl={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {/* Draw lines for each step */}
        {route.segments.map((step, i) => {
          const p1 = getLocation(step.from);
          const p2 = getLocation(step.to);
          return (
            <Polyline 
              key={i} 
              positions={[[p1.lat, p1.lng], [p2.lat, p2.lng]]} 
              pathOptions={{ 
                color: getModeColor(step.mode), 
                weight: 4, 
                opacity: 0.8,
                dashArray: step.mode === 'walk' ? '5, 10' : null 
              }} 
            />
          );
        })}

        {/* Start Marker */}
        <Marker position={[start.lat, start.lng]} icon={startIcon}>
          <Popup><strong>Start:</strong> {start.name}</Popup>
        </Marker>

        {/* Interchange Markers */}
        {points.slice(1, -1).map((p, i) => (
          <Marker key={`interchange-${i}`} position={[p.lat, p.lng]}>
            <Popup><strong>Transfer:</strong> {p.name}</Popup>
          </Marker>
        ))}

        {/* End Marker */}
        <Marker position={[end.lat, end.lng]} icon={endIcon}>
          <Popup><strong>Destination:</strong> {end.name}</Popup>
        </Marker>

        <FitBounds positions={positions} />
      </MapContainer>
    </div>
  );
}
