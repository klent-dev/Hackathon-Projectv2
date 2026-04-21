# Timpla (Hackathon MVP)

Mobile-first client-side route mixer for Cebu commuters.

## Run

- `npm install`
- `npm run dev`

## Route Data

The app reads its route graph from:

- `src/data/routes.generated.js` (data)
- `src/data/routes.js` (stable re-export wrapper)

### Import your own dataset (CSV/JSON → generated JS)

To expand routes, provide a local `routes-input.json` in the project root using the same shape as `routes-input.example.json`, then run:

- `npm run import:routes`

This will regenerate `src/data/routes.generated.js`.

Note: avoid pasting large third-party route datasets into this repo unless you have permission/license to use and redistribute them.
