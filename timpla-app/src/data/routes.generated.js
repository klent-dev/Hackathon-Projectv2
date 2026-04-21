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
  guadalupe: { id: "guadalupe", name: "Guadalupe" },
  banawa: { id: "banawa", name: "Banawa" },
  v_rama: { id: "v_rama", name: "V. Rama Ave" },
  c_padilla: { id: "c_padilla", name: "C. Padilla St" },
  sm_seaside: { id: "sm_seaside", name: "SM Seaside City Cebu" },
  as_fortuna: { id: "as_fortuna", name: "A.S. Fortuna St, Mandaue" },
  parkmall: { id: "parkmall", name: "Parkmall" },
  mactan_airport: { id: "mactan_airport", name: "Mactan-Cebu Int'l Airport" },
  pier_area: { id: "pier_area", name: "Cebu International Port" },
  mandaue_odd: { id: "mandaue_odd", name: "Mandaue (Odd)" },
  mandaue_even: { id: "mandaue_even", name: "Mandaue (Even)" },
  cm_cabahug: { id: "cm_cabahug", name: "C.M. Cabahug" },
  new_public_market: { id: "new_public_market", name: "New Public Market" },
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
  tabunok: { id: "tabunok", name: "Tabunok (Talisay)" },
  tisa: { id: "tisa", name: "Tisa" },
  city_hospital: { id: "city_hospital", name: "Cebu City Medical Center" },
  lapulapu_public_market: { id: "lapulapu_public_market", name: "Lapu-Lapu Public Market" },
  mepz1: { id: "mepz1", name: "MEPZ 1" },
  mepz2: { id: "mepz2", name: "MEPZ 2" },
  punta_engano: { id: "punta_engano", name: "Punta Engaño" },
  lapulapu_city_proper: { id: "lapulapu_city_proper", name: "Lapu-Lapu City Proper" },
  maribago: { id: "maribago", name: "Maribago" },
  marigondon: { id: "marigondon", name: "Marigondon" },
  cordova: { id: "cordova", name: "Cordova" },
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
  { from: "it_park", to: "ayala", mode: "jeepney", line: ["04L", "17B", "17C"], fare: 13, time: 10 },
  { from: "ayala", to: "it_park", mode: "jeepney", line: ["04L", "17B", "17C"], fare: 13, time: 10 },
  { from: "it_park", to: "fuente", mode: "jeepney", line: ["17B", "17C"], fare: 14, time: 15 },
  { from: "fuente", to: "it_park", mode: "jeepney", line: ["17B", "17C"], fare: 14, time: 15 },
  { from: "ayala", to: "sm_city", mode: "jeepney", line: ["04L"], fare: 13, time: 12 },
  { from: "sm_city", to: "ayala", mode: "jeepney", line: ["04L"], fare: 13, time: 12 },
  { from: "fuente", to: "colon", mode: "jeepney", line: ["12L"], fare: 13, time: 10 },
  { from: "colon", to: "fuente", mode: "jeepney", line: ["12L"], fare: 13, time: 10 },
  { from: "colon", to: "carbon", mode: "jeepney", line: ["01K", "02B", "12L"], fare: 13, time: 5 },
  { from: "carbon", to: "colon", mode: "jeepney", line: ["01K", "02B", "12L"], fare: 13, time: 5 },

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

  // Guadalupe / Banawa schematic connections (06/07)
  { from: "guadalupe", to: "capitol", mode: "jeepney", line: ["06B", "06C", "06F", "06G", "07B"], fare: 13, time: 10 },
  { from: "capitol", to: "guadalupe", mode: "jeepney", line: ["06B", "06C", "06F", "06G", "07B"], fare: 13, time: 10 },
  { from: "banawa", to: "capitol", mode: "jeepney", line: ["07B"], fare: 13, time: 10 },
  { from: "capitol", to: "banawa", mode: "jeepney", line: ["07B"], fare: 13, time: 10 },
  { from: "capitol", to: "carbon", mode: "jeepney", line: ["06B", "06C", "06F", "06G", "07B"], fare: 13, time: 18 },
  { from: "carbon", to: "capitol", mode: "jeepney", line: ["06B", "06C", "06F", "06G", "07B"], fare: 13, time: 18 },
  { from: "capitol", to: "v_rama", mode: "jeepney", line: ["06C", "06G"], fare: 13, time: 8 },
  { from: "v_rama", to: "capitol", mode: "jeepney", line: ["06C", "06G"], fare: 13, time: 8 },
  { from: "v_rama", to: "c_padilla", mode: "jeepney", line: ["06G"], fare: 13, time: 10 },
  { from: "c_padilla", to: "v_rama", mode: "jeepney", line: ["06G"], fare: 13, time: 10 },
  { from: "c_padilla", to: "carbon", mode: "jeepney", line: ["06G"], fare: 13, time: 12 },
  { from: "carbon", to: "c_padilla", mode: "jeepney", line: ["06G"], fare: 13, time: 12 },

  // Mandaue schematic connections (20/21/22)
  { from: "pier_area", to: "pier1", mode: "walk", fare: 0, time: 12 },
  { from: "pier1", to: "pier_area", mode: "walk", fare: 0, time: 12 },
  { from: "mandaue_odd", to: "ayala", mode: "jeepney", line: ["20A", "20B"], fare: 15, time: 35 },
  { from: "ayala", to: "mandaue_odd", mode: "jeepney", line: ["20A", "20B"], fare: 15, time: 35 },
  { from: "mandaue_odd", to: "cathedral", mode: "jeepney", line: ["21A", "21D"], fare: 15, time: 40 },
  { from: "cathedral", to: "mandaue_odd", mode: "jeepney", line: ["21A", "21D"], fare: 15, time: 40 },
  { from: "mandaue_odd", to: "pier_area", mode: "jeepney", line: ["21D"], fare: 15, time: 30 },
  { from: "pier_area", to: "mandaue_odd", mode: "jeepney", line: ["21D"], fare: 15, time: 30 },
  { from: "pier_area", to: "cathedral", mode: "jeepney", line: ["21D"], fare: 13, time: 18 },
  { from: "cathedral", to: "pier_area", mode: "jeepney", line: ["21D"], fare: 13, time: 18 },
  { from: "mandaue_even", to: "mandaue_odd", mode: "walk", fare: 0, time: 8 },
  { from: "mandaue_odd", to: "mandaue_even", mode: "walk", fare: 0, time: 8 },
  { from: "mandaue_even", to: "cm_cabahug", mode: "jeepney", line: ["22A", "22D"], fare: 13, time: 15 },
  { from: "cm_cabahug", to: "mandaue_even", mode: "jeepney", line: ["22A", "22D"], fare: 13, time: 15 },
  { from: "new_public_market", to: "mandaue_even", mode: "jeepney", line: ["22I"], fare: 13, time: 10 },
  { from: "mandaue_even", to: "new_public_market", mode: "jeepney", line: ["22I"], fare: 13, time: 10 },
  { from: "new_public_market", to: "banilad", mode: "jeepney", line: ["22I"], fare: 15, time: 25 },
  { from: "banilad", to: "new_public_market", mode: "jeepney", line: ["22I"], fare: 15, time: 25 },

  // Mactan Island schematic connections (23/MI)
  { from: "parkmall", to: "mepz1", mode: "jeepney", line: ["23", "23D", "MI-01A", "MI-02B", "MI-04A"], fare: 20, time: 40 },
  { from: "mepz1", to: "parkmall", mode: "jeepney", line: ["23", "23D", "MI-01A", "MI-02B", "MI-04A"], fare: 20, time: 40 },
  { from: "mepz1", to: "mactan_airport", mode: "jeepney", line: ["MI-05A"], fare: 18, time: 15 },
  { from: "mactan_airport", to: "mepz1", mode: "jeepney", line: ["MI-05A"], fare: 18, time: 15 },
  { from: "mepz2", to: "mactan_airport", mode: "jeepney", line: ["MI-05A"], fare: 18, time: 12 },
  { from: "mactan_airport", to: "mepz2", mode: "jeepney", line: ["MI-05A"], fare: 18, time: 12 },
  { from: "mepz1", to: "mepz2", mode: "jeepney", line: ["MI-04A", "MI-04B"], fare: 18, time: 20 },
  { from: "mepz2", to: "mepz1", mode: "jeepney", line: ["MI-04A", "MI-04B"], fare: 18, time: 20 },
  { from: "mepz2", to: "lapulapu_city_proper", mode: "jeepney", line: ["23D", "MI-01A", "MI-03A", "MI-03B"], fare: 18, time: 25 },
  { from: "lapulapu_city_proper", to: "mepz2", mode: "jeepney", line: ["23D", "MI-01A", "MI-03A", "MI-03B"], fare: 18, time: 25 },
  { from: "mepz1", to: "punta_engano", mode: "jeepney", line: ["23", "MI-01A"], fare: 18, time: 25 },
  { from: "punta_engano", to: "mepz1", mode: "jeepney", line: ["23", "MI-01A"], fare: 18, time: 25 },
  { from: "mepz1", to: "maribago", mode: "jeepney", line: ["MI-02B"], fare: 18, time: 20 },
  { from: "maribago", to: "mepz1", mode: "jeepney", line: ["MI-02B"], fare: 18, time: 20 },
  { from: "maribago", to: "marigondon", mode: "jeepney", line: ["MI-02B"], fare: 18, time: 15 },
  { from: "marigondon", to: "maribago", mode: "jeepney", line: ["MI-02B"], fare: 18, time: 15 },
  { from: "lapulapu_city_proper", to: "cordova", mode: "jeepney", line: ["MI-03A", "MI-03B"], fare: 20, time: 35 },
  { from: "cordova", to: "lapulapu_city_proper", mode: "jeepney", line: ["MI-03A", "MI-03B"], fare: 20, time: 35 },

  // South connector (Tabunok / Talisay area)
  { from: "bulacao", to: "tabunok", mode: "jeepney", line: ["41D", "42D"], fare: 18, time: 25 },
  { from: "tabunok", to: "bulacao", mode: "jeepney", line: ["41D", "42D"], fare: 18, time: 25 },

  // Modern jeep routes (simplified)
  // Urgello → Colon → SM → Parkmall
  { from: "urgello", to: "colon", mode: "modern_jeep", line: ["01K-Modern"], fareMin: 17, fareMax: 22, fare: 17, time: 12 },
  { from: "colon", to: "sm_city", mode: "modern_jeep", line: ["01K-Modern"], fareMin: 17, fareMax: 22, fare: 17, time: 18 },
  { from: "sm_city", to: "parkmall", mode: "modern_jeep", line: ["01K-Modern"], fareMin: 17, fareMax: 22, fare: 17, time: 18 },
  { from: "parkmall", to: "sm_city", mode: "modern_jeep", line: ["01K-Modern"], fareMin: 17, fareMax: 22, fare: 17, time: 18 },
  { from: "sm_city", to: "colon", mode: "modern_jeep", line: ["01K-Modern"], fareMin: 17, fareMax: 22, fare: 17, time: 18 },
  { from: "colon", to: "urgello", mode: "modern_jeep", line: ["01K-Modern"], fareMin: 17, fareMax: 22, fare: 17, time: 12 },

  // Talamban → IT Park → Colon
  { from: "talamban", to: "it_park", mode: "modern_jeep", line: ["13C-Modern"], fareMin: 18, fareMax: 25, fare: 18, time: 22 },
  { from: "it_park", to: "colon", mode: "modern_jeep", line: ["13C-Modern"], fareMin: 18, fareMax: 25, fare: 18, time: 25 },
  { from: "colon", to: "it_park", mode: "modern_jeep", line: ["13C-Modern"], fareMin: 18, fareMax: 25, fare: 18, time: 25 },
  { from: "it_park", to: "talamban", mode: "modern_jeep", line: ["13C-Modern"], fareMin: 18, fareMax: 25, fare: 18, time: 22 },

  // Tabunok → Tisa → Banawa → Lahug → IT Park
  { from: "tabunok", to: "tisa", mode: "modern_jeep", line: ["CIBUS-1"], fareMin: 20, fareMax: 30, fare: 20, time: 18 },
  { from: "tisa", to: "banawa", mode: "modern_jeep", line: ["CIBUS-1"], fareMin: 20, fareMax: 30, fare: 20, time: 12 },
  { from: "banawa", to: "lahug", mode: "modern_jeep", line: ["CIBUS-1"], fareMin: 20, fareMax: 30, fare: 20, time: 20 },
  { from: "lahug", to: "it_park", mode: "modern_jeep", line: ["CIBUS-1"], fareMin: 20, fareMax: 30, fare: 20, time: 12 },
  { from: "it_park", to: "lahug", mode: "modern_jeep", line: ["CIBUS-1"], fareMin: 20, fareMax: 30, fare: 20, time: 12 },
  { from: "lahug", to: "banawa", mode: "modern_jeep", line: ["CIBUS-1"], fareMin: 20, fareMax: 30, fare: 20, time: 20 },
  { from: "banawa", to: "tisa", mode: "modern_jeep", line: ["CIBUS-1"], fareMin: 20, fareMax: 30, fare: 20, time: 12 },
  { from: "tisa", to: "tabunok", mode: "modern_jeep", line: ["CIBUS-1"], fareMin: 20, fareMax: 30, fare: 20, time: 18 },

  // Mandaue → Cebu City (examples)
  { from: "parkmall", to: "ayala", mode: "modern_jeep", line: ["04M-Modern"], fareMin: 18, fareMax: 25, fare: 18, time: 18 },
  { from: "ayala", to: "parkmall", mode: "modern_jeep", line: ["04M-Modern"], fareMin: 18, fareMax: 25, fare: 18, time: 18 },
  { from: "mandaue_odd", to: "colon", mode: "modern_jeep", line: ["21D-Modern"], fareMin: 18, fareMax: 25, fare: 18, time: 35 },
  { from: "colon", to: "mandaue_odd", mode: "modern_jeep", line: ["21D-Modern"], fareMin: 18, fareMax: 25, fare: 18, time: 35 },

  // IT Park → Mactan / Airport
  { from: "it_park", to: "mactan_airport", mode: "modern_jeep", line: ["P2P-Airport"], fareMin: 20, fareMax: 30, fare: 20, time: 45 },
  { from: "mactan_airport", to: "it_park", mode: "modern_jeep", line: ["P2P-Airport"], fareMin: 20, fareMax: 30, fare: 20, time: 45 },

  // Lapu-Lapu Public Market → Airport (24/7)
  { from: "lapulapu_public_market", to: "mactan_airport", mode: "modern_jeep", line: ["MI-05A-Modern"], fareMin: 20, fareMax: 30, fare: 20, time: 18 },
  { from: "mactan_airport", to: "lapulapu_public_market", mode: "modern_jeep", line: ["MI-05A-Modern"], fareMin: 20, fareMax: 30, fare: 20, time: 18 },

  // City Hospital / Banawa loop
  { from: "banawa", to: "city_hospital", mode: "modern_jeep", line: ["07B-Modern"], fareMin: 17, fareMax: 22, fare: 17, time: 12 },
  { from: "city_hospital", to: "ramos", mode: "modern_jeep", line: ["07B-Modern"], fareMin: 17, fareMax: 22, fare: 17, time: 8 },
  { from: "ramos", to: "lahug", mode: "modern_jeep", line: ["07B-Modern"], fareMin: 17, fareMax: 22, fare: 17, time: 16 },
  { from: "lahug", to: "it_park", mode: "modern_jeep", line: ["07B-Modern"], fareMin: 17, fareMax: 22, fare: 17, time: 12 },
  { from: "it_park", to: "lahug", mode: "modern_jeep", line: ["07B-Modern"], fareMin: 17, fareMax: 22, fare: 17, time: 12 },
  { from: "lahug", to: "ramos", mode: "modern_jeep", line: ["07B-Modern"], fareMin: 17, fareMax: 22, fare: 17, time: 16 },
  { from: "ramos", to: "city_hospital", mode: "modern_jeep", line: ["07B-Modern"], fareMin: 17, fareMax: 22, fare: 17, time: 8 },
  { from: "city_hospital", to: "banawa", mode: "modern_jeep", line: ["07B-Modern"], fareMin: 17, fareMax: 22, fare: 17, time: 12 },

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
