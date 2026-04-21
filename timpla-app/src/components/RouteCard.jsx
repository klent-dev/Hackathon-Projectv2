import React, { useState } from "react";
import RouteDetail from "./RouteDetail";
import "./RouteCard.css";

const ICONS = {
  jeepney: "🚐",
  bus: "🚌",
  mybus: "🚍",
  walk: "🚶",
  tricycle: "🛺",
  "habal-habal": "🛵",
};

function RouteCard({ route, isCheapest }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { legs, totalFare, totalTime } = route;

  const modeIcons = legs.map((leg, index) => (
    <span key={index} className="mode-icon" title={leg.mode}>
      {ICONS[leg.mode] || "❓"}
    </span>
  ));

  return (
    <div
      className={`route-card ${isCheapest ? "cheapest" : ""} ${
        isExpanded ? "expanded" : ""
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="card-main">
        <div className="card-left">
          <div className="mode-sequence">{modeIcons}</div>
          <div className="time-estimate">~{totalTime} min</div>
        </div>
        <div className="card-right">
          <div className="total-fare">
            <span>₱</span>
            {totalFare}
          </div>
          {isCheapest && <div className="cheapest-badge">BEST DEAL</div>}
        </div>
      </div>
      {isExpanded && <RouteDetail legs={legs} />}
    </div>
  );
}

export default RouteCard;
