import React from "react";
import { NODES } from "../data/routes";
import "./RouteDetail.css";

const ICONS = {
  jeepney: "🚐",
  bus: "🚌",
  mybus: "🚍",
  walk: "🚶",
  tricycle: "🛺",
  "habal-habal": "🛵",
};

function RouteDetail({ legs }) {
  return (
    <div className="route-detail">
      {legs.map((leg, index) => (
        <div key={index} className="leg-step">
          <div className="leg-icon">{ICONS[leg.mode] || "❓"}</div>
          <div className="leg-info">
            <div className="leg-instruction">
              <strong>
                {leg.mode.replace("_", " ")}
                {leg.line ? ` (${leg.line})` : ""}
              </strong>{" "}
              from{" "}
              <strong>{NODES[leg.from]?.name || leg.from}</strong> to{" "}
              <strong>{NODES[leg.to]?.name || leg.to}</strong>
            </div>
            <div className="leg-meta">
              ~{leg.time} min • ₱{leg.fare}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RouteDetail;
