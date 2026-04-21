// Cebu Metro Transport Network — Route Graph
// Nodes = landmarks, Edges = transport segments with mode, fare, time

export const LOCATIONS = [
  { id: 'it_park', name: 'IT Park', area: 'Cebu City', lat: 10.3294, lng: 123.9056 },
  { id: 'ayala', name: 'Ayala Center', area: 'Cebu City', lat: 10.3183, lng: 123.9050 },
  { id: 'sm_city', name: 'SM City Cebu', area: 'Cebu City', lat: 10.3117, lng: 123.9183 },
  { id: 'colon', name: 'Colon Street', area: 'Cebu City', lat: 10.2965, lng: 123.9001 },
  { id: 'fuente', name: 'Fuente Osmeña', area: 'Cebu City', lat: 10.3114, lng: 123.8962 },
  { id: 'carbon', name: 'Carbon Market', area: 'Cebu City', lat: 10.2936, lng: 123.8993 },
  { id: 'sm_seaside', name: 'SM Seaside / SRP', area: 'Cebu City', lat: 10.2818, lng: 123.8809 },
  { id: 'mandaue', name: 'Mandaue (A.S. Fortuna)', area: 'Mandaue', lat: 10.3400, lng: 123.9350 },
  { id: 'parkmall', name: 'Parkmall', area: 'Mandaue', lat: 10.3267, lng: 123.9353 },
  { id: 'mactan', name: 'Mactan / Lapu-Lapu', area: 'Lapu-Lapu', lat: 10.3126, lng: 123.9790 },
  { id: 'talamban', name: 'Talamban', area: 'Cebu City', lat: 10.3600, lng: 123.9219 },
  { id: 'banilad', name: 'Banilad', area: 'Cebu City', lat: 10.3406, lng: 123.9142 },
  { id: 'capitol', name: 'Capitol / Escario', area: 'Cebu City', lat: 10.3185, lng: 123.8906 },
  { id: 'consolacion', name: 'Consolacion', area: 'Consolacion', lat: 10.3951, lng: 123.9614 },
  { id: 'talisay', name: 'Talisay', area: 'Talisay', lat: 10.2444, lng: 123.8395 },
  { id: 'csbt', name: 'Cebu South Bus Terminal', area: 'Cebu City', lat: 10.2982, lng: 123.8943 },
  { id: 'cnbt', name: 'Cebu North Bus Terminal', area: 'Mandaue', lat: 10.3283, lng: 123.9261 },
];

// Transport modes with colors and icons
export const MODES = {
  jeepney: { label: 'Jeepney', icon: '🚐', color: '#f59e0b' },
  bus: { label: 'Bus', icon: '🚌', color: '#3b82f6' },
  mybus: { label: 'MyBus', icon: '🚍', color: '#06b6d4' },
  tricycle: { label: 'Tricycle', icon: '🛺', color: '#8b5cf6' },
  habal: { label: 'Habal-Habal', icon: '🏍️', color: '#ef4444' },
  walk: { label: 'Walk', icon: '🚶', color: '#10b981' },
  grab: { label: 'Grab / Taxi', icon: '🚕', color: '#f97316' },
  vhire: { label: 'V-Hire', icon: '🚐', color: '#ec4899' },
};

// Edges: each represents a transport segment between two locations
// fare = PHP, time = minutes, routeCode = verified Cebu jeepney route number
// Sources: commutetour.com, LTFRB-7, scribd.com Cebu route lists
export const EDGES = [
  // ===== IT Park Connections =====
  // 04L: Lahug–Ayala–SM  |  17B/17D: Apas/IT Park–Carbon
  { from: 'it_park', to: 'ayala', mode: 'jeepney', fare: 13, time: 15, routeCode: '04L' },
  { from: 'it_park', to: 'ayala', mode: 'grab', fare: 120, time: 10 },
  { from: 'it_park', to: 'sm_city', mode: 'jeepney', fare: 13, time: 20, routeCode: '04L' },
  { from: 'it_park', to: 'sm_city', mode: 'grab', fare: 150, time: 15 },
  { from: 'it_park', to: 'fuente', mode: 'jeepney', fare: 13, time: 20, routeCode: '17B' },
  { from: 'it_park', to: 'banilad', mode: 'jeepney', fare: 13, time: 10, routeCode: '62C' },
  { from: 'it_park', to: 'mandaue', mode: 'jeepney', fare: 15, time: 20, routeCode: '22I' },
  { from: 'it_park', to: 'capitol', mode: 'jeepney', fare: 13, time: 15, routeCode: '17D' },
  { from: 'it_park', to: 'talamban', mode: 'jeepney', fare: 15, time: 25, routeCode: '62C' },

  // ===== Ayala Center Connections =====
  // 14D: Ayala–Colon  |  04L: Lahug–Ayala–SM  |  12L: Labangon–Ayala
  { from: 'ayala', to: 'sm_city', mode: 'jeepney', fare: 13, time: 15, routeCode: '04L' },
  { from: 'ayala', to: 'sm_city', mode: 'grab', fare: 100, time: 10 },
  { from: 'ayala', to: 'fuente', mode: 'jeepney', fare: 13, time: 10, routeCode: '14D' },
  { from: 'ayala', to: 'fuente', mode: 'walk', fare: 0, time: 20 },
  { from: 'ayala', to: 'capitol', mode: 'walk', fare: 0, time: 15 },
  { from: 'ayala', to: 'capitol', mode: 'jeepney', fare: 13, time: 8, routeCode: '14D' },
  { from: 'ayala', to: 'banilad', mode: 'jeepney', fare: 13, time: 12, routeCode: '13C' },
  { from: 'ayala', to: 'csbt', mode: 'jeepney', fare: 13, time: 15, routeCode: '12L' },
  { from: 'ayala', to: 'talisay', mode: 'grab', fare: 200, time: 25 },

  // ===== Fuente Osmeña Connections =====
  // 06B: Guadalupe–Carbon  |  13B: Talamban–Carbon via Banilad
  { from: 'fuente', to: 'colon', mode: 'jeepney', fare: 13, time: 10, routeCode: '06B' },
  { from: 'fuente', to: 'colon', mode: 'walk', fare: 0, time: 18 },
  { from: 'fuente', to: 'capitol', mode: 'walk', fare: 0, time: 5 },
  { from: 'fuente', to: 'sm_city', mode: 'jeepney', fare: 13, time: 12, routeCode: '04L' },
  { from: 'fuente', to: 'carbon', mode: 'jeepney', fare: 13, time: 12, routeCode: '06B' },
  { from: 'fuente', to: 'sm_seaside', mode: 'mybus', fare: 25, time: 20 },
  { from: 'fuente', to: 'banilad', mode: 'jeepney', fare: 13, time: 15, routeCode: '13B' },
  { from: 'fuente', to: 'talamban', mode: 'jeepney', fare: 15, time: 25, routeCode: '13C' },

  // ===== Colon Street Connections =====
  // 03B/03L: Mabolo–Carbon  |  04L: Lahug–SM via Colon
  { from: 'colon', to: 'carbon', mode: 'walk', fare: 0, time: 8 },
  { from: 'colon', to: 'sm_city', mode: 'jeepney', fare: 13, time: 15, routeCode: '04L' },
  { from: 'colon', to: 'sm_seaside', mode: 'jeepney', fare: 15, time: 20, routeCode: '03B' },
  { from: 'colon', to: 'mandaue', mode: 'jeepney', fare: 15, time: 25, routeCode: '22I' },
  { from: 'colon', to: 'csbt', mode: 'walk', fare: 0, time: 12 },
  { from: 'colon', to: 'csbt', mode: 'jeepney', fare: 13, time: 8, routeCode: '12L' },

  // ===== Carbon Market Connections =====
  // 03B: Mabolo–Carbon  |  07B: Banawa–Carbon
  { from: 'carbon', to: 'csbt', mode: 'walk', fare: 0, time: 10 },
  { from: 'carbon', to: 'sm_seaside', mode: 'jeepney', fare: 15, time: 18, routeCode: '03B' },
  { from: 'carbon', to: 'talisay', mode: 'bus', fare: 30, time: 35 },

  // ===== SM City Connections =====
  // 22I: Mandaue–Banilad  |  13C: Talamban–Colon via SM
  { from: 'sm_city', to: 'mandaue', mode: 'jeepney', fare: 13, time: 15, routeCode: '22I' },
  { from: 'sm_city', to: 'parkmall', mode: 'jeepney', fare: 15, time: 20, routeCode: '22I' },
  { from: 'sm_city', to: 'banilad', mode: 'jeepney', fare: 13, time: 10, routeCode: '13C' },
  { from: 'sm_city', to: 'talamban', mode: 'jeepney', fare: 15, time: 20, routeCode: '13C' },
  { from: 'sm_city', to: 'sm_seaside', mode: 'mybus', fare: 25, time: 25 },
  { from: 'sm_city', to: 'consolacion', mode: 'jeepney', fare: 20, time: 35, routeCode: '24' },

  // ===== SM Seaside / SRP Connections =====
  // 42: Talisay–Cebu City
  { from: 'sm_seaside', to: 'talisay', mode: 'jeepney', fare: 15, time: 15, routeCode: '42' },
  { from: 'sm_seaside', to: 'csbt', mode: 'mybus', fare: 25, time: 15 },
  { from: 'sm_seaside', to: 'colon', mode: 'grab', fare: 150, time: 15 },

  // ===== Mandaue Connections =====
  // 22I: Mandaue Market–Banilad  |  MI-02B: Parkmall–Mactan (Punta Engaño)
  { from: 'mandaue', to: 'parkmall', mode: 'jeepney', fare: 13, time: 10, routeCode: '22I' },
  { from: 'mandaue', to: 'parkmall', mode: 'walk', fare: 0, time: 15 },
  { from: 'mandaue', to: 'mactan', mode: 'jeepney', fare: 18, time: 25, routeCode: 'MI-02B' },
  { from: 'mandaue', to: 'mactan', mode: 'grab', fare: 180, time: 20 },
  { from: 'mandaue', to: 'consolacion', mode: 'jeepney', fare: 15, time: 20, routeCode: '24' },
  { from: 'mandaue', to: 'cnbt', mode: 'jeepney', fare: 13, time: 10, routeCode: '22I' },
  { from: 'mandaue', to: 'banilad', mode: 'jeepney', fare: 13, time: 12, routeCode: '22I' },

  // ===== Parkmall Connections =====
  // MI-02B: Parkmall–Punta Engaño (Mactan)
  { from: 'parkmall', to: 'mactan', mode: 'jeepney', fare: 15, time: 20, routeCode: 'MI-02B' },
  { from: 'parkmall', to: 'mactan', mode: 'grab', fare: 150, time: 15 },

  // ===== Talamban Connections =====
  // 13B: Talamban–Carbon  |  13C: Talamban–Colon  |  13H: Pit-os–Mandaue
  { from: 'talamban', to: 'banilad', mode: 'jeepney', fare: 13, time: 12, routeCode: '13B' },
  { from: 'talamban', to: 'consolacion', mode: 'jeepney', fare: 15, time: 20, routeCode: '62C' },
  { from: 'talamban', to: 'mandaue', mode: 'jeepney', fare: 15, time: 25, routeCode: '13H' },

  // ===== Banilad Connections =====
  // 13B: Talamban–Carbon via Banilad  |  13C: Talamban–Colon via Banilad
  { from: 'banilad', to: 'capitol', mode: 'jeepney', fare: 13, time: 10, routeCode: '13B' },
  { from: 'banilad', to: 'talamban', mode: 'jeepney', fare: 13, time: 12, routeCode: '13C' },

  // ===== Capitol Connections =====
  // 06B: Guadalupe–Carbon  |  12L: Labangon–Ayala
  { from: 'capitol', to: 'colon', mode: 'jeepney', fare: 13, time: 12, routeCode: '06B' },
  { from: 'capitol', to: 'csbt', mode: 'jeepney', fare: 13, time: 15, routeCode: '12L' },

  // ===== CSBT Connections =====
  { from: 'csbt', to: 'talisay', mode: 'bus', fare: 25, time: 30 },
  { from: 'csbt', to: 'sm_seaside', mode: 'mybus', fare: 25, time: 15 },

  // ===== CNBT Connections =====
  { from: 'cnbt', to: 'consolacion', mode: 'bus', fare: 20, time: 20 },
  { from: 'cnbt', to: 'mactan', mode: 'vhire', fare: 40, time: 30 },

  // ===== Consolacion =====
  // 24: Consolacion–SM City / North Bus Terminal
  { from: 'consolacion', to: 'mandaue', mode: 'jeepney', fare: 15, time: 20, routeCode: '24' },

  // ===== Talisay =====
  // 41: Tabunok–Colon  |  42: Talisay–Cebu City
  { from: 'talisay', to: 'csbt', mode: 'bus', fare: 25, time: 30 },
  { from: 'talisay', to: 'sm_seaside', mode: 'jeepney', fare: 15, time: 15, routeCode: '42' },

  // ===== Long-haul Grab/Taxi options (expensive baselines) =====
  { from: 'it_park', to: 'mactan', mode: 'grab', fare: 350, time: 35 },
  { from: 'it_park', to: 'talisay', mode: 'grab', fare: 280, time: 30 },
  { from: 'it_park', to: 'consolacion', mode: 'grab', fare: 250, time: 25 },
  { from: 'it_park', to: 'sm_seaside', mode: 'grab', fare: 200, time: 20 },
  { from: 'ayala', to: 'mactan', mode: 'grab', fare: 320, time: 35 },
  { from: 'ayala', to: 'sm_seaside', mode: 'grab', fare: 180, time: 18 },
  { from: 'ayala', to: 'mandaue', mode: 'grab', fare: 180, time: 20 },
  { from: 'colon', to: 'mactan', mode: 'grab', fare: 300, time: 30 },
  { from: 'colon', to: 'it_park', mode: 'grab', fare: 180, time: 18 },
  { from: 'fuente', to: 'mactan', mode: 'grab', fare: 280, time: 30 },
  { from: 'fuente', to: 'it_park', mode: 'grab', fare: 150, time: 15 },
  { from: 'sm_seaside', to: 'it_park', mode: 'grab', fare: 200, time: 20 },
  { from: 'sm_seaside', to: 'mactan', mode: 'grab', fare: 280, time: 30 },
  { from: 'talisay', to: 'it_park', mode: 'grab', fare: 280, time: 30 },
  { from: 'talisay', to: 'mactan', mode: 'grab', fare: 350, time: 40 },
  { from: 'mactan', to: 'it_park', mode: 'grab', fare: 350, time: 35 },
  { from: 'mactan', to: 'colon', mode: 'grab', fare: 300, time: 30 },
  { from: 'consolacion', to: 'it_park', mode: 'grab', fare: 250, time: 25 },
];

// Get location by ID
export function getLocation(id) {
  return LOCATIONS.find(l => l.id === id);
}

// Get location name by ID
export function getLocationName(id) {
  const loc = getLocation(id);
  return loc ? loc.name : id;
}
