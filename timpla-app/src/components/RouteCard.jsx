import React, { useState } from "react";
import { NODES } from "../data/routes";
import RouteDetail from "./RouteDetail";
import "./RouteCard.css";

const ICONS = {
  jeepney: "🚐",
  modern_jeep: "🚐",
  bus: "🚌",
  mybus: "🚍",
  walk: "🚶",
  tricycle: "🛺",
  "habal-habal": "🛵",
};

function RouteCard({ route, isCheapest, isSelected, isExpanded, onToggleExpand, onTakeRoute }) {
  const { legs, totalFareMin, totalFareMax, totalFare, totalTime, etaMin, etaMax, transfers, walkTime } = route;

  const timeLabel =
    typeof etaMin === "number" && typeof etaMax === "number"
      ? `~${etaMin}-${etaMax} min`
      : `~${totalTime} min`;

  const fareMin = typeof totalFareMin === "number" ? totalFareMin : totalFare;
  const fareMax = typeof totalFareMax === "number" ? totalFareMax : totalFare;
  const fareLabel = fareMin === fareMax ? `${fareMin}` : `${fareMin}-${fareMax}`;

  const modeIcons = legs.map((leg, index) => (
    <span key={index} className="mode-icon" title={leg.mode}>
      {ICONS[leg.mode] || "❓"}
    </span>
  ));

  const routeCodes = Array.from(
    new Set(
      legs
        .flatMap((leg) => {
          const line = leg.lineChosen ?? leg.line;
          if (!line) return [];
          return Array.isArray(line) ? line : [line];
        })
        .filter(Boolean)
        .map((code) => String(code))
    )
  );

  const viaStops = (() => {
    if (!Array.isArray(legs) || legs.length < 2) return [];
    const sequence = [legs[0].from, ...legs.map((leg) => leg.to)];
    const intermediate = sequence.slice(1, -1);
    const seen = new Set();
    const orderedUnique = [];
    for (const nodeId of intermediate) {
      if (!nodeId || seen.has(nodeId)) continue;
      seen.add(nodeId);
      orderedUnique.push(nodeId);
    }
    return orderedUnique.map((nodeId) => NODES[nodeId]?.name || nodeId);
  })();

  return (
    <div
      className={`route-card ${isCheapest ? "cheapest" : ""} ${
        isSelected ? "selected" : ""
      } ${
        isExpanded ? "expanded" : ""
      }`}
      onClick={() => onToggleExpand?.(route.id)}
    >
      <div className="card-main">
        <div className="card-left">
          <div className="mode-sequence">{modeIcons}</div>
          <div className="time-estimate">{timeLabel}</div>
          <div className="route-metrics">
            Transfers: {typeof transfers === "number" ? transfers : 0} • Walk: {typeof walkTime === "number" ? walkTime : 0} min
          </div>
          {routeCodes.length > 0 && (
            <div className="route-metrics">Codes: {routeCodes.join(" / ")}</div>
          )}
          {viaStops.length > 0 && (
            <div className="route-metrics">
              Via: {viaStops.slice(0, 4).join(", ")}
              {viaStops.length > 4 ? ` +${viaStops.length - 4} more` : ""}
            </div>
          )}
        </div>
        <div className="card-right">
          <div className="total-fare">
            <span>₱</span>
            {fareLabel}
          </div>
          {isCheapest && <div className="cheapest-badge">BEST DEAL</div>}
          <button
            type="button"
            className="take-route-btn"
            onClick={(event) => {
              event.stopPropagation();
              onTakeRoute(route.id);
            }}
          >
            {isSelected ? "Route selected" : "Take this route"}
          </button>
        </div>
      </div>
      {isExpanded && <RouteDetail legs={legs} />}
    </div>
  );
}

export default RouteCard;
