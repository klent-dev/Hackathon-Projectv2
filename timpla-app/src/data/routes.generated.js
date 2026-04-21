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
  urgello: { id: "urgello", name: "Urgello" },
  sambag: { id: "sambag", name: "Sambag" },
  sanciangko: { id: "sanciangko", name: "Sanciangko" },
  south_bus: { id: "south_bus", name: "Cebu South Bus Terminal" },
  pier1: { id: "pier1", name: "Cebu Pier 1" },
  bulacao: { id: "bulacao", name: "Bulacao" },
  basak: { id: "basak", name: "Basak" },
  n_bacalso: { id: "n_bacalso", name: "N. Bacalso Ave" },
  magallanes: { id: "magallanes", name: "Magallanes" },
  inayawan: { id: "inayawan", name: "Inayawan" },
  alumnos: { id: "alumnos", name: "Alumnos" },
  labangon: { id: "labangon", name: "Labangon" },
  punta_princesa: { id: "punta_princesa", name: "Punta Princesa" },
  cathedral: { id: "cathedral", name: "Cebu Cathedral" },
  lahug: { id: "lahug", name: "Lahug" },
  apas: { id: "apas", name: "Apas" },
  camp_lapu_lapu: { id: "camp_lapu_lapu", name: "Camp Lapu-Lapu" },
  plaza_housing: { id: "plaza_housing", name: "Plaza Housing" },
  oprra: { id: "oprra", name: "OPRRA" },
  panganiban: { id: "panganiban", name: "Panganiban" },
  ramos: { id: "ramos", name: "Ramos" },
  osmena: { id: "osmena", name: "Osmeña" },
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

  { from: "sm_city", to: "parkmall", mode: "jeepney", line: ["01K"], fare: 13, time: 15 },
  { from: "parkmall", to: "sm_city", mode: "jeepney", line: ["01K"], fare: 13, time: 15 },

  // Urgello / Sambag / Pier area schematic connections
  { from: "urgello", to: "sambag", mode: "jeepney", line: ["01K"], fare: 13, time: 8 },
  { from: "sambag", to: "urgello", mode: "jeepney", line: ["01K"], fare: 13, time: 8 },
  { from: "sambag", to: "sanciangko", mode: "jeepney", line: ["01B", "01C", "01K", "02B"], fare: 13, time: 6 },
  { from: "sanciangko", to: "sambag", mode: "jeepney", line: ["01B", "01C", "01K", "02B"], fare: 13, time: 6 },
  { from: "sanciangko", to: "colon", mode: "jeepney", line: ["01B", "01C", "01K", "02B"], fare: 13, time: 5 },
  { from: "colon", to: "sanciangko", mode: "jeepney", line: ["01B", "01C", "01K", "02B"], fare: 13, time: 5 },
  { from: "sambag", to: "south_bus", mode: "jeepney", line: ["02B"], fare: 13, time: 8 },
  { from: "south_bus", to: "sambag", mode: "jeepney", line: ["02B"], fare: 13, time: 8 },
  { from: "colon", to: "pier1", mode: "jeepney", line: ["01B", "01C", "02B"], fare: 13, time: 8 },
  { from: "pier1", to: "colon", mode: "jeepney", line: ["01B", "01C", "02B"], fare: 13, time: 8 },
  { from: "sanciangko", to: "sm_city", mode: "jeepney", line: ["01K"], fare: 13, time: 20 },
  { from: "sm_city", to: "sanciangko", mode: "jeepney", line: ["01K"], fare: 13, time: 20 },

  // Basak / Bulacao schematic connections
  { from: "bulacao", to: "basak", mode: "jeepney", line: ["10F", "10G", "10H", "10M"], fare: 13, time: 18 },
  { from: "basak", to: "bulacao", mode: "jeepney", line: ["10F", "10G", "10H", "10M"], fare: 13, time: 18 },
  { from: "basak", to: "n_bacalso", mode: "jeepney", line: ["09C", "09F", "09G", "10F", "10G", "10H", "10M"], fare: 13, time: 10 },
  { from: "n_bacalso", to: "basak", mode: "jeepney", line: ["09C", "09F", "09G", "10F", "10G", "10H", "10M"], fare: 13, time: 10 },
  { from: "n_bacalso", to: "colon", mode: "jeepney", line: ["09C", "09F", "10F", "10H", "10M"], fare: 13, time: 15 },
  { from: "colon", to: "n_bacalso", mode: "jeepney", line: ["09C", "09F", "10F", "10H", "10M"], fare: 13, time: 15 },
  { from: "n_bacalso", to: "magallanes", mode: "jeepney", line: ["09G"], fare: 13, time: 12 },
  { from: "magallanes", to: "n_bacalso", mode: "jeepney", line: ["09G"], fare: 13, time: 12 },
  { from: "magallanes", to: "carbon", mode: "jeepney", line: ["09C", "09G", "10G"], fare: 13, time: 6 },
  { from: "carbon", to: "magallanes", mode: "jeepney", line: ["09C", "09G", "10G"], fare: 13, time: 6 },
  { from: "colon", to: "sm_city", mode: "jeepney", line: ["10H", "10M"], fare: 13, time: 20 },
  { from: "sm_city", to: "colon", mode: "jeepney", line: ["10H", "10M"], fare: 13, time: 20 },

  // Alumnos / Inayawan schematic connections
  { from: "inayawan", to: "alumnos", mode: "jeepney", line: ["11A"], fare: 13, time: 8 },
  { from: "alumnos", to: "inayawan", mode: "jeepney", line: ["11A"], fare: 13, time: 8 },
  { from: "alumnos", to: "colon", mode: "jeepney", line: ["08G", "11A"], fare: 13, time: 12 },
  { from: "colon", to: "alumnos", mode: "jeepney", line: ["08G", "11A"], fare: 13, time: 12 },

  // Labangon schematic connections
  { from: "labangon", to: "punta_princesa", mode: "jeepney", line: ["12D", "12G", "12I", "12L"], fare: 13, time: 10 },
  { from: "punta_princesa", to: "labangon", mode: "jeepney", line: ["12D", "12G", "12I", "12L"], fare: 13, time: 10 },
  { from: "punta_princesa", to: "magallanes", mode: "jeepney", line: ["12D", "12G"], fare: 13, time: 10 },
  { from: "magallanes", to: "punta_princesa", mode: "jeepney", line: ["12D", "12G"], fare: 13, time: 10 },
  { from: "magallanes", to: "colon", mode: "jeepney", line: ["12D", "12L"], fare: 13, time: 6 },
  { from: "colon", to: "magallanes", mode: "jeepney", line: ["12D", "12L"], fare: 13, time: 6 },
  { from: "colon", to: "cathedral", mode: "jeepney", line: ["12D", "12G", "12L"], fare: 13, time: 5 },
  { from: "cathedral", to: "colon", mode: "jeepney", line: ["12D", "12G", "12L"], fare: 13, time: 5 },
  { from: "cathedral", to: "sm_city", mode: "jeepney", line: ["12G", "12I"], fare: 13, time: 22 },
  { from: "sm_city", to: "cathedral", mode: "jeepney", line: ["12G", "12I"], fare: 13, time: 22 },
  { from: "colon", to: "ayala", mode: "jeepney", line: ["12L"], fare: 13, time: 20 },
  { from: "ayala", to: "colon", mode: "jeepney", line: ["12L"], fare: 13, time: 20 },

  // Lahug / Capitol / Apas schematic connections
  { from: "lahug", to: "ayala", mode: "jeepney", line: ["04M", "14D"], fare: 13, time: 18 },
  { from: "ayala", to: "lahug", mode: "jeepney", line: ["04M", "14D"], fare: 13, time: 18 },
  { from: "lahug", to: "plaza_housing", mode: "jeepney", line: ["04D", "04H", "04I"], fare: 13, time: 15 },
  { from: "plaza_housing", to: "lahug", mode: "jeepney", line: ["04D", "04H", "04I"], fare: 13, time: 15 },
  { from: "lahug", to: "camp_lapu_lapu", mode: "jeepney", line: ["04B", "04C"], fare: 13, time: 8 },
  { from: "camp_lapu_lapu", to: "lahug", mode: "jeepney", line: ["04B", "04C"], fare: 13, time: 8 },
  { from: "lahug", to: "apas", mode: "jeepney", line: ["17B", "17C", "17D"], fare: 13, time: 10 },
  { from: "apas", to: "lahug", mode: "jeepney", line: ["17B", "17C", "17D"], fare: 13, time: 10 },
  { from: "lahug", to: "oprra", mode: "jeepney", line: ["15"], fare: 13, time: 15 },
  { from: "oprra", to: "lahug", mode: "jeepney", line: ["15"], fare: 13, time: 15 },
  { from: "oprra", to: "capitol", mode: "walk", fare: 0, time: 8 },
  { from: "capitol", to: "oprra", mode: "walk", fare: 0, time: 8 },
  { from: "colon", to: "panganiban", mode: "walk", fare: 0, time: 5 },
  { from: "panganiban", to: "colon", mode: "walk", fare: 0, time: 5 },
  { from: "fuente", to: "ramos", mode: "walk", fare: 0, time: 6 },
  { from: "ramos", to: "fuente", mode: "walk", fare: 0, time: 6 },
  { from: "fuente", to: "osmena", mode: "walk", fare: 0, time: 4 },
  { from: "osmena", to: "fuente", mode: "walk", fare: 0, time: 4 },

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
