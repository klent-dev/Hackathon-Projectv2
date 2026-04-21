import React from "react";
import { NODES } from "../data/routes";
import "./RouteDetail.css";

const ICONS = {
  jeepney: "🚐",
  modern_jeep: "🚐",
  bus: "🚌",
  mybus: "🚍",
  walk: "🚶",
  tricycle: "🛺",
  "habal-habal": "🛵",
};

function normalizeCodes(line) {
  if (!line) return [];
  return (Array.isArray(line) ? line : [line]).map((code) => String(code)).filter(Boolean);
}

function intersect(left, right) {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  const [small, large] = leftSet.size <= rightSet.size ? [leftSet, rightSet] : [rightSet, leftSet];
  const out = [];
  for (const item of small) {
    if (large.has(item)) out.push(item);
  }
  return out;
}

function compressLegsForDisplay(legs) {
  const output = [];
  let current = null;

  for (const leg of legs) {
    if (!current) {
      current = { ...leg, _codes: normalizeCodes(leg.lineChosen ?? leg.line) };
      continue;
    }

    const canMerge =
      current.mode !== "walk" &&
      leg.mode !== "walk" &&
      current.mode === leg.mode;

    if (!canMerge) {
      output.push({ ...current, line: current._codes.length > 0 ? current._codes : current.line });
      current = { ...leg, _codes: normalizeCodes(leg.line) };
      continue;
    }

    const nextCodes = normalizeCodes(leg.lineChosen ?? leg.line);
    const commonCodes = intersect(current._codes, nextCodes);

    if (commonCodes.length === 0 && current._codes.length > 0 && nextCodes.length > 0) {
      // Different codes: this is a transfer, don't merge.
      output.push({ ...current, line: current._codes.length > 0 ? current._codes : current.line });
      current = { ...leg, _codes: nextCodes };
      continue;
    }

    // Merge: extend destination, accumulate fare/time, and keep only codes common to all merged legs.
    current = {
      ...current,
      to: leg.to,
      time: (current.time || 0) + (leg.time || 0),
      fare: current.fare ?? leg.fare,
      fareMin: current.fareMin ?? leg.fareMin ?? current.fare ?? leg.fare,
      fareMax: current.fareMax ?? leg.fareMax ?? current.fare ?? leg.fare,
      _codes: current._codes.length === 0 ? nextCodes : nextCodes.length === 0 ? current._codes : commonCodes,
    };
  }

  if (current) {
    output.push({ ...current, line: current._codes.length > 0 ? current._codes : current.line });
  }

  return output;
}

function formatLine(line) {
  if (!line) return "";
  return Array.isArray(line) ? line.join(" / ") : line;
}

function formatFare(leg) {
  const minFare = leg.fareMin ?? leg.fare;
  const maxFare = leg.fareMax ?? leg.fare;
  if (typeof minFare !== "number" || typeof maxFare !== "number") {
    return `₱${leg.fare ?? 0}`;
  }
  return minFare === maxFare ? `₱${minFare}` : `₱${minFare}–${maxFare}`;
}

function RouteDetail({ legs }) {
  const displayLegs = compressLegsForDisplay(legs);

  return (
    <div className="route-detail">
      {displayLegs.map((leg, index) => (
        <div key={index} className="leg-step">
          <div className="leg-icon">{ICONS[leg.mode] || "❓"}</div>
          <div className="leg-info">
            <div className="leg-instruction">
              <strong>
                {leg.mode.replace("_", " ")}
                {leg.lineChosen || leg.line ? ` (${formatLine(leg.lineChosen ?? leg.line)})` : ""}
              </strong>{" "}
              from{" "}
              <strong>{NODES[leg.from]?.name || leg.from}</strong> to{" "}
              <strong>{NODES[leg.to]?.name || leg.to}</strong>
            </div>
            <div className="leg-meta">
              ~{leg.time} min • {formatFare(leg)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RouteDetail;
