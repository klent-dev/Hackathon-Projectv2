import { EDGES, MODES, getLocationName } from '../data/routes.js';

/**
 * Build an adjacency list from the edges (bidirectional)
 */
function buildGraph() {
  const graph = {};
  for (const edge of EDGES) {
    if (!graph[edge.from]) graph[edge.from] = [];
    if (!graph[edge.to]) graph[edge.to] = [];
    // Add both directions
    graph[edge.from].push({ ...edge, target: edge.to });
    graph[edge.to].push({ ...edge, target: edge.from, from: edge.to, to: edge.from });
  }
  return graph;
}

const graph = buildGraph();

/**
 * Find all routes between two locations using BFS with multi-modal paths.
 * Returns up to maxRoutes routes, sorted by cost.
 * Each route is an array of segments (edges).
 */
export function findRoutes(originId, destId, maxRoutes = 4) {
  if (originId === destId) return [];

  const allRoutes = [];
  // BFS queue: each item is { currentNode, path (array of edges), visitedNodes, totalFare, totalTime }
  const queue = [{ node: originId, path: [], visited: new Set([originId]), fare: 0, time: 0 }];

  // Limit search depth to avoid exponential blowup
  const MAX_HOPS = 4;
  const MAX_QUEUE = 5000;
  let iterations = 0;

  while (queue.length > 0 && iterations < MAX_QUEUE) {
    iterations++;
    const current = queue.shift();

    if (current.path.length >= MAX_HOPS) continue;

    const neighbors = graph[current.node] || [];

    for (const edge of neighbors) {
      if (current.visited.has(edge.target)) continue;

      const newFare = current.fare + edge.fare;
      const newTime = current.time + edge.time;
      const newPath = [...current.path, edge];

      if (edge.target === destId) {
        allRoutes.push({
          segments: newPath,
          totalFare: newFare,
          totalTime: newTime,
          modes: [...new Set(newPath.map(s => s.mode))],
        });
      } else {
        const newVisited = new Set(current.visited);
        newVisited.add(edge.target);
        queue.push({ node: edge.target, path: newPath, visited: newVisited, fare: newFare, time: newTime });
      }
    }
  }

  // Sort by fare (cheapest first)
  allRoutes.sort((a, b) => a.totalFare - b.totalFare);

  // Deduplicate: remove routes with the exact same mode sequence and similar fare
  const unique = [];
  const seen = new Set();
  for (const route of allRoutes) {
    const key = route.segments.map(s => `${s.from}-${s.mode}-${s.to}`).join('|');
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(route);
    }
    if (unique.length >= maxRoutes + 2) break; // Get a few extra for filtering
  }

  return unique.slice(0, maxRoutes);
}

/**
 * Get the most expensive single-mode route (Grab/Taxi) for savings comparison
 */
export function getExpensiveBaseline(originId, destId) {
  // Look for direct Grab/taxi edge
  const grabEdge = EDGES.find(
    e =>
      (e.from === originId && e.to === destId && e.mode === 'grab') ||
      (e.from === destId && e.to === originId && e.mode === 'grab')
  );

  if (grabEdge) {
    return {
      mode: 'grab',
      fare: grabEdge.fare,
      time: grabEdge.time,
      label: `Grab / Taxi direct`,
    };
  }

  // Estimate Grab fare based on typical Cebu pricing: base 50 + 15/km, estimate distance from time
  // Rough estimate: average speed 20km/h in Cebu traffic
  const routes = findRoutes(originId, destId, 1);
  if (routes.length > 0) {
    const cheapestTime = routes[0].totalTime;
    const estimatedKm = (cheapestTime / 60) * 15; // rough
    const estimatedGrab = Math.round(50 + estimatedKm * 15);
    return {
      mode: 'grab',
      fare: Math.max(estimatedGrab, routes[0].totalFare + 80),
      time: Math.round(cheapestTime * 0.7), // Grab is faster
      label: 'Grab / Taxi (estimated)',
    };
  }

  return { mode: 'grab', fare: 200, time: 20, label: 'Grab / Taxi (estimated)' };
}

/**
 * Format a route into human-readable steps
 */
export function formatRouteSteps(route) {
  return route.segments.map((seg, i) => {
    const mode = MODES[seg.mode];
    const routeCode = seg.routeCode || null;
    const modeWithCode = routeCode ? `${mode.label} ${routeCode}` : mode.label;
    return {
      step: i + 1,
      icon: mode.icon,
      mode: mode.label,
      routeCode: routeCode,
      color: mode.color,
      from: getLocationName(seg.from),
      to: getLocationName(seg.to),
      fare: seg.fare,
      time: seg.time,
      instruction: seg.mode === 'walk'
        ? `Walk from ${getLocationName(seg.from)} to ${getLocationName(seg.to)}`
        : `Take ${modeWithCode} from ${getLocationName(seg.from)} → ${getLocationName(seg.to)}`,
    };
  });
}
