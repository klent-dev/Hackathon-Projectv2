import { EDGES, NODES } from "../data/routes";

const DEFAULT_FIND_OPTIONS = {
  priority: "cheapest", // 'balanced' | 'fastest' | 'cheapest' | 'fewestTransfers' | 'leastWalking'
  avoidWalking: false,
};

// Fare ranges (₱) by jeepney code, based on provided fare bands.
const JEEPNEY_FARE_RANGES = {
  "01B": { min: 13, max: 15 },
  "01C": { min: 13, max: 15 },
  "01K": { min: 14, max: 18 },
  "02B": { min: 13, max: 15 },
  "03A": { min: 13, max: 16 },
  "03B": { min: 13, max: 16 },
  "03L": { min: 13, max: 16 },
  "03Q": { min: 13, max: 15 },
  "04B": { min: 14, max: 18 },
  "04C": { min: 14, max: 18 },
  "04D": { min: 15, max: 20 },
  "04H": { min: 15, max: 20 },
  "04I": { min: 15, max: 20 },
  "04L": { min: 13, max: 16 },
  "04M": { min: 13, max: 15 },
  "06B": { min: 13, max: 16 },
  "06C": { min: 13, max: 15 },
  "06F": { min: 13, max: 16 },
  "06H": { min: 14, max: 17 },
  "07B": { min: 13, max: 15 },
  "08F": { min: 14, max: 18 },
  "08G": { min: 13, max: 15 },
  "09C": { min: 14, max: 18 },
  "09F": { min: 14, max: 18 },
  "09G": { min: 14, max: 18 },
  "10F": { min: 15, max: 20 },
  "10G": { min: 15, max: 20 },
  "10H": { min: 15, max: 20 },
  "11A": { min: 15, max: 20 },
  "12D": { min: 13, max: 16 },
  "12G": { min: 13, max: 16 },
  "12L": { min: 14, max: 17 },
  "13B": { min: 15, max: 20 },
  "13C": { min: 15, max: 20 },
  "13H": { min: 15, max: 20 },
  "14D": { min: 13, max: 15 },
  "17B": { min: 14, max: 17 },
  "17C": { min: 14, max: 17 },
  "17D": { min: 14, max: 17 },
  "20A": { min: 14, max: 18 },
  "20B": { min: 14, max: 18 },
  "21A": { min: 14, max: 18 },
  "21B": { min: 14, max: 18 },
  "22A": { min: 14, max: 18 },
  "22B": { min: 14, max: 18 },
  "22I": { min: 14, max: 18 },
  "23": { min: 18, max: 25 },
  "23D": { min: 18, max: 25 },
  "24": { min: 20, max: 30 },
  "25": { min: 20, max: 30 },
  "26": { min: 20, max: 30 },
  "27": { min: 20, max: 30 },
  "41D": { min: 18, max: 25 },
  "42D": { min: 18, max: 25 },
  "43": { min: 20, max: 30 },
  "62B": { min: 15, max: 20 },
};

function normalizeFindOptions(options) {
  const merged = { ...DEFAULT_FIND_OPTIONS, ...(options || {}) };

  const allowed = new Set([
    "balanced",
    "fastest",
    "cheapest",
    "fewestTransfers",
    "leastWalking",
  ]);

  return {
    priority: allowed.has(merged.priority) ? merged.priority : DEFAULT_FIND_OPTIONS.priority,
    avoidWalking: Boolean(merged.avoidWalking),
  };
}

function formatPriorityLabel(priority) {
  switch (priority) {
    case "fastest":
      return "Fastest";
    case "cheapest":
      return "Cheapest";
    case "fewestTransfers":
      return "Fewest transfers";
    case "leastWalking":
      return "Least walking";
    case "balanced":
    default:
      return "Balanced";
  }
}

function getLegLineKey(line) {
  if (!line) return "";
  return Array.isArray(line) ? line.join(",") : String(line);
}

function getEdgeCodes(edge) {
  if (!edge?.line) return [];
  const codes = Array.isArray(edge.line) ? edge.line : [edge.line];
  return codes.map((code) => String(code)).filter(Boolean);
}

function getFareRangeForEdge(edge) {
  const explicitMin = Number(edge?.fareMin);
  const explicitMax = Number(edge?.fareMax);
  if (Number.isFinite(explicitMin) && Number.isFinite(explicitMax)) {
    return { min: explicitMin, max: explicitMax };
  }

  const fallback = { min: Number(edge?.fare || 0), max: Number(edge?.fare || 0) };

  if (!edge || edge.mode === "walk") {
    return fallback;
  }

  const codes = getEdgeCodes(edge);
  if (codes.length === 0) {
    return fallback;
  }

  const ranges = codes
    .map((code) => JEEPNEY_FARE_RANGES[code])
    .filter(Boolean);

  if (ranges.length === 0) {
    return fallback;
  }

  return {
    min: Math.min(...ranges.map((range) => range.min)),
    max: Math.max(...ranges.map((range) => range.max)),
  };
}

function getFareRangeForEdgeWithPreferredCode(edge, preferredCode) {
  if (preferredCode && JEEPNEY_FARE_RANGES[preferredCode]) {
    return JEEPNEY_FARE_RANGES[preferredCode];
  }

  // If it's a custom/modern code, rely on edge-provided ranges.
  const explicitMin = Number(edge?.fareMin);
  const explicitMax = Number(edge?.fareMax);
  if (Number.isFinite(explicitMin) && Number.isFinite(explicitMax)) {
    return { min: explicitMin, max: explicitMax };
  }

  return getFareRangeForEdge(edge);
}

function attachFareRangesToLegs(legs) {
  return legs.map((leg) => {
    const { min, max } = getFareRangeForEdgeWithPreferredCode(leg, leg.lineChosen);
    return {
      ...leg,
      fareMin: Number.isFinite(min) ? min : leg.fare,
      fareMax: Number.isFinite(max) ? max : leg.fare,
    };
  });
}

function normalizeCodesFromLeg(leg) {
  if (leg?.lineChosen) return [String(leg.lineChosen)];
  return getEdgeCodes(leg);
}

function dijkstraCheapestWithRideState(adjacency, startNodeId, endNodeId, avoidWalking) {
  // Cost is lexicographic: fare dominates time.
  // Using a large multiplier avoids needing a custom comparator.
  const FARE_WEIGHT = 1000;
  const WALK_PENALTY = avoidWalking ? 100000 : 0;

  const stateKey = (nodeId, rideKey) => `${nodeId}::${rideKey || ""}`;

  const nodeIds = Array.from(adjacency.keys());
  const rideKeys = new Set([""]); // empty means "not riding"

  // Seed ride keys based on known codes (keeps the search space bounded but practical).
  for (const edge of EDGES) {
    if (edge.mode === "walk") continue;
    for (const code of getEdgeCodes(edge)) {
      rideKeys.add(code);
    }
    rideKeys.add(`MODE:${edge.mode}`);
  }

  const dist = new Map();
  const prev = new Map();
  const visited = new Set();

  const startKey = stateKey(startNodeId, "");
  dist.set(startKey, 0);

  const allStates = [];
  for (const nodeId of nodeIds) {
    for (const rideKey of rideKeys) {
      allStates.push(stateKey(nodeId, rideKey === "" ? "" : rideKey));
    }
  }

  const parseState = (key) => {
    const [nodeId, rideKey] = key.split("::");
    return { nodeId, rideKey: rideKey || "" };
  };

  while (visited.size < allStates.length) {
    let currentKey = null;
    let bestDist = Infinity;

    for (const key of allStates) {
      if (visited.has(key)) continue;
      const d = dist.get(key);
      if (typeof d === "number" && d < bestDist) {
        bestDist = d;
        currentKey = key;
      }
    }

    if (currentKey === null || bestDist === Infinity) break;

    const { nodeId: currentNodeId, rideKey: currentRideKey } = parseState(currentKey);
    if (currentNodeId === endNodeId) break;

    visited.add(currentKey);

    const edges = adjacency.get(currentNodeId) || [];
    for (const edge of edges) {
      if (edge.mode === "walk") {
        const nextKey = stateKey(edge.to, "");
        const alt = bestDist + (0 * FARE_WEIGHT) + edge.time + WALK_PENALTY;
        if (alt < (dist.get(nextKey) ?? Infinity)) {
          dist.set(nextKey, alt);
          prev.set(nextKey, { fromState: currentKey, edge, chosenCode: null, fromNode: currentNodeId });
        }
        continue;
      }

      const edgeCodes = getEdgeCodes(edge);
      const candidates = edgeCodes.length > 0 ? edgeCodes : [null];

      for (const code of candidates) {
        const rideKey = code ? code : `MODE:${edge.mode}`;
        const isContinuing = currentRideKey && currentRideKey === rideKey;
        const { min: fareMin } = getFareRangeForEdgeWithPreferredCode(edge, code);
        const addFare = isContinuing ? 0 : Number(fareMin || 0);
        const nextKey = stateKey(edge.to, rideKey);

        const alt = bestDist + addFare * FARE_WEIGHT + edge.time;
        if (alt < (dist.get(nextKey) ?? Infinity)) {
          dist.set(nextKey, alt);
          prev.set(nextKey, { fromState: currentKey, edge, chosenCode: code, fromNode: currentNodeId });
        }
      }
    }
  }

  // Pick best end state (any ride key).
  let bestEndKey = null;
  let bestEndDist = Infinity;
  for (const rideKey of rideKeys) {
    const key = stateKey(endNodeId, rideKey === "" ? "" : rideKey);
    const d = dist.get(key);
    if (typeof d === "number" && d < bestEndDist) {
      bestEndDist = d;
      bestEndKey = key;
    }
  }

  if (!bestEndKey && startNodeId !== endNodeId) {
    return null;
  }

  const legs = [];
  let cursor = bestEndKey;
  while (cursor && cursor !== startKey) {
    const step = prev.get(cursor);
    if (!step) return null;
    legs.push({ ...step.edge, from: step.fromNode, to: step.edge.to, lineChosen: step.chosenCode });
    cursor = step.fromState;
  }
  legs.reverse();
  return legs;
}

function intersectSets(left, right) {
  if (!left || !right) return new Set();
  const [small, large] = left.size <= right.size ? [left, right] : [right, left];
  const out = new Set();
  for (const item of small) {
    if (large.has(item)) out.add(item);
  }
  return out;
}

function getBoardingIdentitySet(leg) {
  const codes = getEdgeCodes(leg);
  if (codes.length > 0) return new Set(codes);
  return new Set([String(leg.mode || "ride")]);
}

function computeRouteMetrics(legs) {
  // Charge fare when boarding a new ride (code/mode change). Staying on the same code shouldn't double-charge.
  let totalFareMin = 0;
  let totalFareMax = 0;
  const totalTime = legs.reduce((sum, leg) => sum + (leg.time || 0), 0);

  const boardingLegs = legs.filter((leg) => leg.mode !== "walk");

  let transfers = 0;
  let previousIdentity = null;
  for (const leg of boardingLegs) {
    const codes = normalizeCodesFromLeg(leg);
    const currentIdentity = codes.length > 0 ? new Set(codes) : new Set([String(leg.mode || "ride")]);

    const { min: fareMin, max: fareMax } = getFareRangeForEdgeWithPreferredCode(leg, leg.lineChosen);
    const legFareMin = Number.isFinite(fareMin) ? fareMin : (leg.fareMin ?? leg.fare ?? 0);
    const legFareMax = Number.isFinite(fareMax) ? fareMax : (leg.fareMax ?? leg.fare ?? 0);

    if (previousIdentity) {
      const overlap = intersectSets(previousIdentity, currentIdentity);
      if (overlap.size === 0) {
        transfers += 1;
        totalFareMin += legFareMin;
        totalFareMax += legFareMax;
        previousIdentity = currentIdentity;
      } else {
        // Continue ride; keep only the common identity moving forward.
        previousIdentity = overlap;
      }
    } else {
      totalFareMin += legFareMin;
      totalFareMax += legFareMax;
      previousIdentity = currentIdentity;
    }
  }

  // If all boarding legs share at least one common jeep code, treat as a "direct" ride.
  let directCodes = [];
  if (boardingLegs.length > 0) {
    let common = null;
    for (const leg of boardingLegs) {
      const codes = new Set(normalizeCodesFromLeg(leg));
      if (codes.size === 0) {
        common = new Set();
        break;
      }
      common = common ? intersectSets(common, codes) : codes;
      if (common.size === 0) break;
    }
    if (common && common.size > 0) {
      directCodes = Array.from(common);
      transfers = 0;
    }
  }

  const walkTime = legs.filter((leg) => leg.mode === "walk").reduce((sum, leg) => sum + (leg.time || 0), 0);

  return {
    totalFareMin,
    totalFareMax,
    // Back-compat: treat totalFare as the lowest possible fare.
    totalFare: totalFareMin,
    totalTime,
    transfers,
    walkTime,
    directCodes,
    boardingCount: boardingLegs.length,
    legsCount: legs.length,
  };
}

function estimateEtaRangeMinutes(legs) {
  let minMinutes = 0;
  let maxMinutes = 0;

  for (const leg of legs) {
    const base = Number(leg.time || 0);
    let minFactor = 1;
    let maxFactor = 1;

    if (leg.mode === "walk") {
      minFactor = 1;
      maxFactor = 1.1;
    } else if (leg.mode === "mybus" || leg.mode === "bus") {
      minFactor = 0.85;
      maxFactor = 1.3;
    } else {
      // Default: jeepneys & other road-based modes tend to be the most variable.
      minFactor = 0.75;
      maxFactor = 1.5;
    }

    minMinutes += base * minFactor;
    maxMinutes += base * maxFactor;
  }

  const etaMin = Math.max(1, Math.round(minMinutes));
  const etaMax = Math.max(etaMin, Math.round(maxMinutes));
  return { etaMin, etaMax };
}

function scoreRoute(metrics, options) {
  switch (options.priority) {
    case "cheapest":
      return metrics.totalFare * 1000 + metrics.totalTime * 10 + metrics.transfers * 200;
    case "fastest":
      return metrics.totalTime * 1000 + metrics.totalFare * 50 + metrics.transfers * 200;
    case "fewestTransfers":
      return metrics.transfers * 100000 + metrics.totalTime * 100 + metrics.totalFare * 50;
    case "leastWalking":
      return metrics.walkTime * 100000 + metrics.totalTime * 100 + metrics.totalFare * 50;
    case "balanced":
    default:
      // Roughly treat ₱1 ~= 4 minutes, plus a mild penalty for extra transfers.
      return (metrics.totalFare * 4 + metrics.totalTime) * 100 + metrics.transfers * 500;
  }
}

function buildExplanation(metrics, options) {
  const priorityLabel = formatPriorityLabel(options.priority);

  let summary = "Balanced route with good time and cost.";
  if (options.priority === "fastest") summary = "Optimized for the shortest travel time.";
  if (options.priority === "cheapest") summary = "Optimized for the lowest fare.";
  if (options.priority === "fewestTransfers") summary = "Optimized to minimize transfers (fewer rides).";
  if (options.priority === "leastWalking") summary = "Optimized to reduce walking between stops.";

  if (options.avoidWalking) {
    summary += " Walking legs are heavily avoided.";
  }

  if (metrics.directCodes && metrics.directCodes.length > 0) {
    summary += ` Direct ride possible (${metrics.directCodes.join(" / ")}).`;
  } else if (metrics.transfers === 0 && metrics.boardingCount > 0) {
    summary += " Direct ride possible (no transfers).";
  }

  return {
    priority: options.priority,
    priorityLabel,
    summary,
    metrics,
  };
}

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
export function findRoutes(startNodeId, endNodeId, options) {
  const normalizedOptions = normalizeFindOptions(options);
  const adjacency = buildAdjacency();

  const candidates = [];

  const walkPenalty = normalizedOptions.avoidWalking ? 100000 : 0;

  const fareLegs = dijkstraCheapestWithRideState(
    adjacency,
    startNodeId,
    endNodeId,
    normalizedOptions.avoidWalking
  );
  if (fareLegs) candidates.push({ id: "fare", legs: attachFareRangesToLegs(fareLegs) });

  const timeLegs = dijkstraPath(
    adjacency,
    startNodeId,
    endNodeId,
    (edge) => edge.time + (edge.mode === "walk" ? walkPenalty : 0)
  );
  if (timeLegs) candidates.push({ id: "time", legs: attachFareRangesToLegs(timeLegs) });

  // Balanced: roughly treat ₱1 ~= 4 minutes (tweakable)
  const balancedLegs = dijkstraPath(
    adjacency,
    startNodeId,
    endNodeId,
    (edge) => getFareRangeForEdge(edge).min * 4 + edge.time + (edge.mode === "walk" ? walkPenalty : 0)
  );
  if (balancedLegs) candidates.push({ id: "balanced", legs: attachFareRangesToLegs(balancedLegs) });

  // Fewest transfers (approx): strongly prefer fewer ride legs.
  const transfersLegs = dijkstraPath(
    adjacency,
    startNodeId,
    endNodeId,
    (edge) => {
      const boardingPenalty = edge.mode === "walk" ? 0 : 60;
      const walkingPenalty = edge.mode === "walk" ? 25 : 0;
      return edge.time + getFareRangeForEdge(edge).min + boardingPenalty + walkingPenalty + (edge.mode === "walk" ? walkPenalty : 0);
    }
  );
  if (transfersLegs) candidates.push({ id: "transfers", legs: attachFareRangesToLegs(transfersLegs) });

  // Least walking: allow walking, but make it expensive.
  const leastWalkLegs = dijkstraPath(
    adjacency,
    startNodeId,
    endNodeId,
    (edge) => edge.time + getFareRangeForEdge(edge).min * 2 + (edge.mode === "walk" ? 250 : 0) + (edge.mode === "walk" ? walkPenalty : 0)
  );
  if (leastWalkLegs) candidates.push({ id: "least-walk", legs: attachFareRangesToLegs(leastWalkLegs) });

  // Direct route attempt: stay on a single jeepney code (when possible).
  const outgoingCodes = new Set();
  const incomingCodes = new Set();
  for (const edge of EDGES) {
    if (edge.mode === "walk") continue;
    const codes = getEdgeCodes(edge);
    if (codes.length === 0) continue;
    if (edge.from === startNodeId) {
      codes.forEach((code) => outgoingCodes.add(code));
    }
    if (edge.to === endNodeId) {
      codes.forEach((code) => incomingCodes.add(code));
    }
  }

  const directCandidateCodes = Array.from(outgoingCodes).filter((code) => incomingCodes.has(code));
  for (const code of directCandidateCodes) {
    const directLegs = dijkstraPath(adjacency, startNodeId, endNodeId, (edge) => {
      if (edge.mode === "walk") {
        return normalizedOptions.avoidWalking ? Infinity : edge.time + 150;
      }

      const codes = getEdgeCodes(edge);
      if (!codes.includes(code)) return Infinity;
      return edge.time + getFareRangeForEdge(edge).min * 2;
    });

    if (directLegs) {
      candidates.push({ id: `direct-${code}`, legs: attachFareRangesToLegs(directLegs), directCode: code });
    }
  }

  const processed = candidates.map((combo) => {
    const metrics = computeRouteMetrics(combo.legs);
    const { etaMin, etaMax } = estimateEtaRangeMinutes(combo.legs);
    const score = scoreRoute(metrics, normalizedOptions);
    const explanation = buildExplanation(metrics, normalizedOptions);
    return {
      ...combo,
      id: `${combo.id}-${startNodeId}-${endNodeId}-${normalizedOptions.priority}-${normalizedOptions.avoidWalking ? "nowalk" : "walk"}`,
      ...metrics,
      etaMin,
      etaMax,
      score,
      explanation,
    };
  });

  const unique = Array.from(
    new Map(
      processed.map((c) => [
        c.legs
          .map((l) => `${l.mode}:${l.from}->${l.to}:${getLegLineKey(l.line)}`)
          .join("|"),
        c,
      ])
    ).values()
  );

  unique.sort(
    (a, b) =>
      a.score - b.score ||
      a.totalFare - b.totalFare ||
      a.totalTime - b.totalTime
  );

  const cheapest = unique.reduce((best, route) => {
    if (!best) return route;
    return route.totalFare < best.totalFare ? route : best;
  }, null);
  const direct = unique.find((route) => (route.directCodes?.length || 0) > 0 || route.transfers === 0);
  const modern = unique.find((route) => route.legs?.some((leg) => leg.mode === "modern_jeep"));

  const mustInclude = [cheapest, direct, modern].filter(Boolean);
  const final = [];

  for (const route of mustInclude) {
    if (!final.some((existing) => existing.id === route.id)) {
      final.push(route);
    }
    if (final.length >= 4) break;
  }

  for (const route of unique) {
    if (final.length >= 4) break;
    if (!final.some((existing) => existing.id === route.id)) {
      final.push(route);
    }
  }

  return final.slice(0, 4);
}

/**
 * Calculates the savings vs. the most expensive single-mode option (Grab/taxi).
 */
export function calculateSavings(routeOptions) {
  if (routeOptions.length < 2) {
    return { cheapest: null, expensive: null, savings: 0 };
  }

  const cheapest = [...routeOptions].sort((a, b) => a.totalFare - b.totalFare)[0];
  const expensive = [...routeOptions].sort((a, b) => b.totalFare - a.totalFare)[0];

  const savings = Math.max(0, expensive.totalFare - cheapest.totalFare);

  return {
    cheapest,
    expensive,
    savings,
  };
}
