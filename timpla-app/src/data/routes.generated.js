// GENERATED (or hand-maintained) route graph for Timpla.
//
// Keep this file focused on structured data only.
// If you want to regenerate it from a CSV/JSON source, use:
//   npm run import:routes

export const NODES = {
  it_park: { id: "it_park", name: "Cebu IT Park" },
  ayala: { id: "ayala", name: "Ayala Center Cebu" },
  sm_city: { id: "sm_city", name: "SM City Cebu" },
  colon: { id: "colon", name: "Colon Street" },
  fuente: { id: "fuente", name: "Fuente Osmeña Circle" },
  carbon: { id: "carbon", name: "Carbon Market" },
  sm_seaside: { id: "sm_seaside", name: "SM Seaside City Cebu" },
  as_fortuna: { id: "as_fortuna", name: "A.S. Fortuna St, Mandaue" },
  parkmall: { id: "parkmall", name: "Parkmall" },
  mactan_airport: { id: "mactan_airport", name: "Mactan-Cebu Int'l Airport" },
  talamban: { id: "talamban", name: "Talamban" },
  banilad: { id: "banilad", name: "Banilad" },
  capitol: { id: "capitol", name: "Cebu Provincial Capitol" },
  consolacion: { id: "consolacion", name: "Consolacion" },
  talisay: { id: "talisay", name: "Talisay City" },
};

// Each edge is a directed connection.
// Fields:
// - from/to: node ids
// - mode: 'jeepney' | 'mybus' | 'walk' | ...
// - line: optional route code (e.g. '01K')
// - fare: peso cost for this leg
// - time: minutes for this leg
export const EDGES = [
  // Jeepney Routes
  { from: "it_park", to: "ayala", mode: "jeepney", fare: 13, time: 10 },
  { from: "ayala", to: "it_park", mode: "jeepney", fare: 13, time: 10 },
  { from: "it_park", to: "fuente", mode: "jeepney", fare: 14, time: 15 },
  { from: "fuente", to: "it_park", mode: "jeepney", fare: 14, time: 15 },
  { from: "ayala", to: "sm_city", mode: "jeepney", fare: 13, time: 12 },
  { from: "sm_city", to: "ayala", mode: "jeepney", fare: 13, time: 12 },
  { from: "fuente", to: "colon", mode: "jeepney", fare: 13, time: 10 },
  { from: "colon", to: "fuente", mode: "jeepney", fare: 13, time: 10 },
  { from: "colon", to: "carbon", mode: "jeepney", fare: 13, time: 5 },
  { from: "carbon", to: "colon", mode: "jeepney", fare: 13, time: 5 },

  // 01K (Colon ↔ Parkmall)
  { from: "colon", to: "parkmall", mode: "jeepney", line: "01K", fare: 15, time: 35 },
  { from: "parkmall", to: "colon", mode: "jeepney", line: "01K", fare: 15, time: 35 },

  { from: "sm_city", to: "parkmall", mode: "jeepney", fare: 13, time: 15 },
  { from: "parkmall", to: "sm_city", mode: "jeepney", fare: 13, time: 15 },

  // MyBus Routes
  { from: "sm_city", to: "sm_seaside", mode: "mybus", fare: 25, time: 25 },
  { from: "sm_seaside", to: "sm_city", mode: "mybus", fare: 25, time: 25 },
  { from: "talamban", to: "sm_city", mode: "mybus", fare: 30, time: 30 },
  { from: "sm_city", to: "talamban", mode: "mybus", fare: 30, time: 30 },
  { from: "talisay", to: "sm_seaside", mode: "mybus", fare: 25, time: 20 },
  { from: "sm_seaside", to: "talisay", mode: "mybus", fare: 25, time: 20 },

  // Walking (important connections)
  { from: "colon", to: "carbon", mode: "walk", fare: 0, time: 8 },
  { from: "carbon", to: "colon", mode: "walk", fare: 0, time: 8 },
  { from: "fuente", to: "capitol", mode: "walk", fare: 0, time: 12 },
  { from: "capitol", to: "fuente", mode: "walk", fare: 0, time: 12 },
];
