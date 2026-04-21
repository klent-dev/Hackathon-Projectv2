import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import { NODES } from "../data/routes";
import { DEFAULT_MAP_CENTER, NODE_COORDINATES } from "../data/routeLocations";
import "leaflet/dist/leaflet.css";
import "./RouteJourneyPage.css";

const ICONS = {
  jeepney: "🚐",
  modern_jeep: "🚐",
  bus: "🚌",
  mybus: "🚍",
  walk: "🚶",
  tricycle: "🛺",
  "habal-habal": "🛵",
};

function getStopName(nodeId) {
  return NODES[nodeId]?.name || nodeId;
}

function getNodeCoordinates(nodeId) {
  return NODE_COORDINATES[nodeId] || DEFAULT_MAP_CENTER;
}

function toLonLat([lat, lon]) {
  return `${lon},${lat}`;
}

function toLeafletLatLngs(coordinates) {
  return coordinates.map(([lon, lat]) => [lat, lon]);
}

function buildJourneyPath(route) {
  const path = [];

  route.legs.forEach((leg, index) => {
    if (index === 0) {
      path.push({ nodeId: leg.from, role: "start" });
    }

    path.push({ nodeId: leg.to, role: leg.mode === "walk" ? "transfer" : "arrival" });
  });

  return path;
}

function buildBoardingStops(route) {
  return route.legs
    .filter((leg) => leg.mode !== "walk")
    .map((leg, index) => ({
      id: `${leg.from}-${leg.to}-${index}`,
      line: formatLine(leg.lineChosen ?? leg.line),
      displayLine: formatLine(leg.lineChosen ?? leg.line) || leg.mode,
      nodeId: leg.from,
      stopName: getStopName(leg.from),
      destinationName: getStopName(leg.to),
      mode: leg.mode,
      fareMin: leg.fareMin ?? leg.fare,
      fareMax: leg.fareMax ?? leg.fare,
      time: leg.time,
    }));
}

function formatLine(line) {
  if (!line) return "";
  return Array.isArray(line) ? line.join(" / ") : line;
}

function formatFareRange(minFare, maxFare) {
  if (typeof minFare !== "number" || typeof maxFare !== "number") {
    return "₱0";
  }
  return minFare === maxFare ? `₱${minFare}` : `₱${minFare}–${maxFare}`;
}

function formatLegFare(leg) {
  const minFare = leg.fareMin ?? leg.fare;
  const maxFare = leg.fareMax ?? leg.fare;
  return formatFareRange(minFare, maxFare);
}

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
      output.push({ ...current, line: current._codes.length > 0 ? current._codes : current.line });
      current = { ...leg, _codes: nextCodes };
      continue;
    }

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

function FitBounds({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length < 2) return;

    map.fitBounds(L.latLngBounds(positions), {
      padding: [36, 36],
      animate: false,
    });
  }, [map, positions]);

  return null;
}

async function fetchRoadGeometryForLeg(leg, signal) {
  const profile = leg.mode === "walk" ? "foot" : "driving";
  const fromCoordinates = getNodeCoordinates(leg.from);
  const toCoordinates = getNodeCoordinates(leg.to);
  const cacheKey = `timpla-osrm:${profile}:${leg.from}->${leg.to}`;

  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore cache failures.
  }

  const url = `https://router.project-osrm.org/route/v1/${profile}/${toLonLat(fromCoordinates)};${toLonLat(toCoordinates)}?overview=full&geometries=geojson&steps=false`;

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Routing request failed with ${response.status}`);
  }

  const data = await response.json();
  const routeGeometry = data?.routes?.[0]?.geometry?.coordinates;

  if (!Array.isArray(routeGeometry) || routeGeometry.length === 0) {
    throw new Error("No route geometry returned");
  }

  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(routeGeometry));
  } catch {
    // Ignore cache failures.
  }

  return routeGeometry;
}

function createStopIcon(label, kind) {
  return L.divIcon({
    className: `route-stop-marker route-stop-marker-${kind}`,
    html: `<span>${label}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -16],
  });
}

function RouteJourneyPage({ route, onBackToResults }) {
  const [roadPath, setRoadPath] = useState([]);
  const [roadLoading, setRoadLoading] = useState(true);
  const [roadError, setRoadError] = useState("");
  const [showAllStops, setShowAllStops] = useState(false);

  const displayLegs = useMemo(() => compressLegsForDisplay(route.legs), [route.legs]);

  const startName = getStopName(route.legs[0]?.from);
  const endName = getStopName(route.legs[route.legs.length - 1]?.to);
  const journeyPath = buildJourneyPath(route);
  const boardingStops = useMemo(() => buildBoardingStops({ ...route, legs: displayLegs }), [route, displayLegs]);
  const routeStops = useMemo(
    () => route.legs.map((leg, index) => ({ leg, index })),
    [route]
  );
  const fallbackRoutePath = useMemo(() => {
    const fallbackPath = [];

    route.legs.forEach((leg, index) => {
      if (index === 0) {
        fallbackPath.push(getNodeCoordinates(leg.from));
      }

      fallbackPath.push(getNodeCoordinates(leg.to));
    });

    return fallbackPath;
  }, [route]);
  const stopSummaries = journeyPath.map((stop, index) => ({
    ...stop,
    id: `${stop.nodeId}-${index}`,
    label: getStopName(stop.nodeId),
    lines: Array.from(
      new Set(
        boardingStops
          .filter((boarding) => boarding.nodeId === stop.nodeId)
          .map((boarding) => boarding.line)
          .filter(Boolean)
      )
    ),
    note:
      stop.role === "start"
        ? "Starting point"
        : stop.role === "transfer"
          ? "Transfer point"
          : "Destination stop",
  }));
  const boardingNodeIds = new Set(boardingStops.map((stop) => stop.nodeId));
  const etaLabel =
    typeof route.etaMin === "number" && typeof route.etaMax === "number"
      ? `~${route.etaMin}-${route.etaMax} min`
      : `~${route.totalTime} min`;
    const fareMin = typeof route.totalFareMin === "number" ? route.totalFareMin : route.totalFare;
    const fareMax = typeof route.totalFareMax === "number" ? route.totalFareMax : route.totalFare;
    const fareLabel = formatFareRange(fareMin, fareMax);

    const viaStops = useMemo(() => {
      const legs = route.legs || [];
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
      return orderedUnique.map((nodeId) => getStopName(nodeId));
    }, [route.legs]);
  const transfers = typeof route.transfers === "number" ? route.transfers : Math.max(0, boardingStops.length - 1);
  const walkTime = typeof route.walkTime === "number" ? route.walkTime : route.legs.filter((leg) => leg.mode === "walk").reduce((sum, leg) => sum + (leg.time || 0), 0);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    async function loadRoadPath() {
      setRoadLoading(true);
      setRoadError("");

      try {
        const segments = [];

        for (const { leg } of routeStops) {
          const geometry = await fetchRoadGeometryForLeg(leg, controller.signal);
          segments.push(...geometry);
        }

        if (isActive) {
          setRoadPath(toLeafletLatLngs(segments));
        }
      } catch (error) {
        if (isActive && error?.name !== "AbortError") {
          setRoadPath(fallbackRoutePath);
          setRoadError("Live road routing is temporarily unavailable, so a fallback route is shown.");
        }
      } finally {
        if (isActive) {
          setRoadLoading(false);
        }
      }
    }

    loadRoadPath();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [route, routeStops]);

  return (
    <section className="journey-page">
      <div className="journey-header">
        <div>
          <p className="journey-eyebrow">Route map</p>
          <h2>{startName} to {endName}</h2>
        </div>
        <div className="journey-actions">
          <button type="button" className="journey-back-btn" onClick={onBackToResults}>
            Choose another route
          </button>
        </div>
      </div>

      <div className="journey-grid">
        <article className="journey-panel journey-map-panel">
          <div className="panel-heading">
            <span className="panel-kicker">Map view</span>
            <h3>Interactive route map</h3>
          </div>

          <div className="journey-map-shell">
            <div className="map-controls-overlay">
              <button 
                type="button" 
                className={`map-control-btn ${showAllStops ? "active" : ""}`}
                onClick={() => setShowAllStops((prev) => !prev)}
              >
                🚏 {showAllStops ? "Hide All Stops" : "Show All Stops"}
              </button>
            </div>

            <MapContainer
              className="journey-map"
              center={DEFAULT_MAP_CENTER}
              zoom={12}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              <FitBounds positions={roadPath.length > 0 ? roadPath : fallbackRoutePath} />
              <Polyline positions={roadPath.length > 0 ? roadPath : fallbackRoutePath} pathOptions={{ color: "#4d6cff", weight: 6, lineJoin: "round", lineCap: "round" }} />

              {/* Show all traditional and modern jeepney stops from our database/API */}
              {showAllStops &&
                Object.entries(NODE_COORDINATES).map(([nodeId, coords]) => (
                  <Marker
                    key={`all-stops-${nodeId}`}
                    position={coords}
                    icon={createStopIcon("🚏", "all-stop")}
                  >
                    <Popup>
                      <strong>{NODES[nodeId]?.name || nodeId}</strong>
                      <br />
                      <small>Jeepney / Modern Jeep Stop</small>
                    </Popup>
                  </Marker>
                ))}

              {stopSummaries.map((stop, index) => {
                const isStart = stop.role === "start";
                const isEnd = index === stopSummaries.length - 1;
                const isBoarding = boardingNodeIds.has(stop.nodeId);
                const kind = isStart ? "start" : isEnd ? "end" : isBoarding ? "boarding" : stop.role;
                const iconLabel = isStart ? "S" : isEnd ? "E" : isBoarding ? "B" : "T";

                return (
                  <Marker
                    key={stop.id}
                    position={getNodeCoordinates(stop.nodeId)}
                    icon={createStopIcon(iconLabel, kind)}
                  >
                    <Popup>
                      <strong>{stop.label}</strong>
                      {stop.lines.length > 0 && (
                        <>
                          <br />
                          <small>Jeep codes: {stop.lines.join(", ")}</small>
                        </>
                      )}
                      <br />
                      {isStart
                        ? "Start here"
                        : isEnd
                          ? "Your destination"
                          : isBoarding
                            ? "Board your ride here"
                            : stop.note}
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

            {roadLoading && <div className="map-status-banner">Loading road-following route...</div>}
            {roadError && <div className="map-status-banner map-status-warning">{roadError}</div>}

            <div className="map-legend">
              <span><i className="legend-dot start" /> Start</span>
              <span><i className="legend-dot boarding" /> Board here</span>
              <span><i className="legend-dot end" /> Destination</span>
            </div>
          </div>
        </article>

        <article className="journey-panel journey-detail-panel">
          <div className="panel-heading">
            <span className="panel-kicker">Trip details</span>
            <h3>Boarding stops and route instructions</h3>
          </div>

          <div className="journey-summary">
            <div>
              <span>Fare</span>
              <strong>{fareLabel}</strong>
            </div>
            <div>
              <span>ETA range</span>
              <strong>{etaLabel}</strong>
            </div>
            <div>
              <span>Transfers</span>
              <strong>{transfers}</strong>
            </div>
            <div>
              <span>Walking</span>
              <strong>~{walkTime} min</strong>
            </div>
          </div>

          {route.explanation?.summary && (
            <div className="journey-explain">
              <div className="panel-heading compact">
                <span className="panel-kicker">Why</span>
                <h3>Why this route</h3>
              </div>
              <div className="journey-explain-body">
                <div className="journey-explain-summary">{route.explanation.summary}</div>
                {route.explanation.priorityLabel && (
                  <div className="journey-explain-meta">Priority: {route.explanation.priorityLabel}</div>
                )}
                {viaStops.length > 0 && (
                  <div className="journey-explain-meta">
                    Passes through: {viaStops.join(", ")}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="boarding-stops">
            <div className="panel-heading compact">
              <span className="panel-kicker">Bus stops</span>
              <h3>Where to board</h3>
            </div>

            <div className="boarding-stop-list">
              {boardingStops.map((stop, index) => (
                <div key={stop.id} className="boarding-stop-card">
                  <div className="boarding-stop-badge">{index + 1}</div>
                  <div className="boarding-stop-copy">
                    <div className="boarding-stop-title">
                      {stop.displayLine} at {stop.stopName}
                    </div>
                    <div className="boarding-stop-body">
                      Board here and ride to {stop.destinationName}.
                    </div>
                    <div className="boarding-stop-meta">~{stop.time} min • {formatFareRange(stop.fareMin, stop.fareMax)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="journey-legs">
            {displayLegs.map((leg, index) => (
              <div key={`${leg.from}-${leg.to}-${index}`} className="journey-leg-card">
                <div className="journey-leg-icon">{ICONS[leg.mode] || "❓"}</div>
                <div className="journey-leg-copy">
                  <div className="journey-leg-title">
                    {leg.mode === "walk"
                      ? `Walk from ${getStopName(leg.from)} to ${getStopName(leg.to)}`
                      : `Board ${formatLine(leg.lineChosen ?? leg.line) || leg.mode} at ${getStopName(leg.from)}`}
                  </div>
                  <div className="journey-leg-body">
                    {leg.mode === "walk"
                      ? "This is a transfer leg between stops."
                      : `Ride to ${getStopName(leg.to)} and get off there.`}
                  </div>
                  <div className="journey-leg-meta">
                    ~{leg.time} min • {formatLegFare(leg)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

export default RouteJourneyPage;
