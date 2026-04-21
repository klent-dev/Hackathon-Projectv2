import React, { useState } from 'react';
import { MODES } from '../data/routes.js';
import { formatRouteSteps } from '../engine/routeFinder.js';
import RouteMap from './RouteMap.jsx';

export default function RouteCard({ route, index, isCheapest }) {
  const [expanded, setExpanded] = useState(false);
  const steps = formatRouteSteps(route);

  return (
    <div
      className={`route-card ${isCheapest ? 'cheapest' : ''} ${expanded ? 'expanded' : ''}`}
      style={{ animationDelay: `${index * 0.12}s` }}
      onClick={() => setExpanded(!expanded)}
      id={`route-card-${index}`}
    >
      {isCheapest && (
        <div className="best-deal-badge">
          <span>💰 BEST DEAL</span>
        </div>
      )}

      <div className="route-card-header">
        <div className="route-modes">
          {route.segments.map((seg, i) => {
            const mode = MODES[seg.mode];
            return (
              <React.Fragment key={i}>
                <span
                  className="mode-chip"
                  style={{ backgroundColor: mode.color + '22', borderColor: mode.color }}
                >
                  <span className="mode-icon">{mode.icon}</span>
                  <span className="mode-label">{mode.label}</span>
                  {seg.routeCode && <span className="route-code">{seg.routeCode}</span>}
                </span>
                {i < route.segments.length - 1 && <span className="mode-arrow">→</span>}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="route-card-body">
        <div className="route-fare">
          <span className="fare-currency">₱</span>
          <span className="fare-amount">{route.totalFare}</span>
        </div>
        <div className="route-time">
          <span className="time-icon">⏱</span>
          <span className="time-text">{route.totalTime} min</span>
        </div>
        <div className="route-hops">
          <span className="hops-text">{route.segments.length} {route.segments.length === 1 ? 'step' : 'steps'}</span>
        </div>
      </div>

      {expanded && (
        <div className="route-detail">
          <div className="map-container">
            <RouteMap route={route} />
          </div>
          <div className="detail-divider"></div>
          {steps.map((step, i) => (
            <div className="detail-step" key={i}>
              <div className="step-indicator">
                <span className="step-dot" style={{ backgroundColor: step.color }}></span>
                {i < steps.length - 1 && <span className="step-line" style={{ backgroundColor: step.color + '44' }}></span>}
              </div>
              <div className="step-content">
                <div className="step-header">
                  <span className="step-icon">{step.icon}</span>
                  <span className="step-mode">{step.mode}</span>
                  {step.routeCode && <span className="step-route-code">{step.routeCode}</span>}
                  <span className="step-fare">₱{step.fare}</span>
                </div>
                <p className="step-instruction">{step.instruction}</p>
                <span className="step-time">{step.time} min</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="route-card-footer">
        <span className="expand-hint">{expanded ? 'Tap to collapse' : 'Tap for details'}</span>
      </div>
    </div>
  );
}
