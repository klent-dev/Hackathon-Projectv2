import { EDGES, NODES } from "../data/routes";

function buildAdjacency() {
  const adjacency = new Map();
  for (const nodeId of Object.keys(NODES)) {
    adjacency.set(nodeId, []);
  }
  for (const edge of EDGES) {
    if (!adjacency.has(edge.from)) adjacency.set(edge.from, []);
    if (!adjacency.has(edge.to)) adjacency.set(edge.to, []);
    adjacency.get(edge.from).push(edge);
  }
  return adjacency;
}

function dijkstraPath(adjacency, startNodeId, endNodeId, weightFn) {
  const nodeIds = Array.from(adjacency.keys());
  const dist = new Map(nodeIds.map((id) => [id, Infinity]));
  const prev = new Map();
  const visited = new Set();

  dist.set(startNodeId, 0);

  while (visited.size < nodeIds.length) {
    let current = null;
    let bestDist = Infinity;

    for (const nodeId of nodeIds) {
      if (visited.has(nodeId)) continue;
      const d = dist.get(nodeId);
      if (d < bestDist) {
        bestDist = d;
        current = nodeId;
      }
    }

    if (current === null || bestDist === Infinity) break;
    if (current === endNodeId) break;

    visited.add(current);

    const edges = adjacency.get(current) || [];
    for (const edge of edges) {
      const alt = bestDist + weightFn(edge);
      if (alt < dist.get(edge.to)) {
        dist.set(edge.to, alt);
        prev.set(edge.to, { from: current, edge });
      }
    }
  }

  if (!prev.has(endNodeId) && startNodeId !== endNodeId) {
    return null;
  }

  const legs = [];
  let cursor = endNodeId;
  while (cursor !== startNodeId) {
    const step = prev.get(cursor);
    if (!step) return null;
    legs.push({ ...step.edge, from: step.from, to: cursor });
    cursor = step.from;
  }
  legs.reverse();
  return legs;
}

/**
 * Finds mixed-mode routes between two points.
 * MVP approach: compute a few "good" routes using different weights.
 */
export function findRoutes(startNodeId, endNodeId) {
  const adjacency = buildAdjacency();

  const candidates = [];

  const fareLegs = dijkstraPath(
    adjacency,
    startNodeId,
    endNodeId,
    (edge) => edge.fare
  );
  if (fareLegs) candidates.push({ id: "fare", legs: fareLegs });

  const timeLegs = dijkstraPath(
    adjacency,
    startNodeId,
    endNodeId,
    (edge) => edge.time
  );
  if (timeLegs) candidates.push({ id: "time", legs: timeLegs });

  // Balanced: roughly treat ₱1 ~= 4 minutes (tweakable)
  const balancedLegs = dijkstraPath(
    adjacency,
    startNodeId,
    endNodeId,
    (edge) => edge.fare * 4 + edge.time
  );
  if (balancedLegs) candidates.push({ id: "balanced", legs: balancedLegs });

  const processed = candidates.map((combo) => {
    const totalFare = combo.legs.reduce((sum, leg) => sum + leg.fare, 0);
    const totalTime = combo.legs.reduce((sum, leg) => sum + leg.time, 0);
    return {
      ...combo,
      id: `${combo.id}-${startNodeId}-${endNodeId}`,
      totalFare,
      totalTime,
    };
  });

  const unique = Array.from(
    new Map(
      processed.map((c) => [
        c.legs.map((l) => `${l.mode}:${l.from}->${l.to}`).join("|"),
        c,
      ])
    ).values()
  );

  unique.sort((a, b) => a.totalFare - b.totalFare || a.totalTime - b.totalTime);
  return unique.slice(0, 4);
}

/**
 * Calculates the savings vs. the most expensive single-mode option (Grab/taxi).
 */
export function calculateSavings(routeOptions) {
  if (routeOptions.length < 2) {
    return { cheapest: null, expensive: null, savings: 0 };
  }

  const cheapest = routeOptions[0];
  const expensive = [...routeOptions].sort((a, b) => b.totalFare - a.totalFare)[0];

  const savings = Math.max(0, expensive.totalFare - cheapest.totalFare);

  return {
    cheapest,
    expensive,
    savings,
  };
}
