import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import { NODES } from "../data/routes";
import { DEFAULT_MAP_CENTER, NODE_COORDINATES } from "../data/routeLocations";
import "leaflet/dist/leaflet.css";
import "./RouteJourneyPage.css";

const ICONS = {
  jeepney: "🚐",
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
      line: formatLine(leg.line),
      displayLine: formatLine(leg.line) || leg.mode,
      nodeId: leg.from,
      stopName: getStopName(leg.from),
      destinationName: getStopName(leg.to),
      mode: leg.mode,
      fare: leg.fare,
      time: leg.time,
    }));
}

function formatLine(line) {
  if (!line) return "";
  return Array.isArray(line) ? line.join(" / ") : line;
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

  const startName = getStopName(route.legs[0]?.from);
  const endName = getStopName(route.legs[route.legs.length - 1]?.to);
  const journeyPath = buildJourneyPath(route);
  const boardingStops = buildBoardingStops(route);
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
          <p className="journey-subtitle">
            Follow the schematic map, board at the highlighted stops, and transfer when needed.
          </p>
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
            <MapContainer
              className="journey-map"
              center={DEFAULT_MAP_CENTER}
              zoom={12}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FitBounds positions={roadPath.length > 0 ? roadPath : fallbackRoutePath} />
              <Polyline positions={roadPath.length > 0 ? roadPath : fallbackRoutePath} pathOptions={{ color: "#4d6cff", weight: 6, lineJoin: "round", lineCap: "round" }} />

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
              <strong>₱{route.totalFare}</strong>
            </div>
            <div>
              <span>Time</span>
              <strong>~{route.totalTime} min</strong>
            </div>
            <div>
              <span>Legs</span>
              <strong>{route.legs.length}</strong>
            </div>
          </div>

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
                    <div className="boarding-stop-meta">~{stop.time} min • ₱{stop.fare}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="journey-legs">
            {route.legs.map((leg, index) => (
              <div key={`${leg.from}-${leg.to}-${index}`} className="journey-leg-card">
                <div className="journey-leg-icon">{ICONS[leg.mode] || "❓"}</div>
                <div className="journey-leg-copy">
                  <div className="journey-leg-title">
                    {leg.mode === "walk"
                      ? `Walk from ${getStopName(leg.from)} to ${getStopName(leg.to)}`
                      : `Board ${formatLine(leg.line) || leg.mode} at ${getStopName(leg.from)}`}
                  </div>
                  <div className="journey-leg-body">
                    {leg.mode === "walk"
                      ? "This is a transfer leg between stops."
                      : `Ride to ${getStopName(leg.to)} and get off there.`}
                  </div>
                  <div className="journey-leg-meta">
                    ~{leg.time} min • ₱{leg.fare}
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
