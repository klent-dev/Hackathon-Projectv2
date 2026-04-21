// Stable import path for the route graph.
//
// The actual data lives in `routes.generated.js` so it can be regenerated from
// a local CSV/JSON without changing imports across the app.
export { EDGES, NODES } from "./routes.generated.js";
