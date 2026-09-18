import { SpatialGrid } from './spatialSearch.js';

const grid = new SpatialGrid();

// Simulate incoming emergency calls with GPS coordinates
const emergencyCalls = [
  { id: "SOS-001", type: "Medical", lat: 13.0827, lng: 80.2707, details: "Downtown district" },
  { id: "SOS-002", type: "Fire", lat: 13.0830, lng: 80.2710, details: "Same neighborhood block" },
  { id: "SOS-003", type: "Rescue", lat: 12.9716, lng: 77.5946, details: "Different city sector" }
];

console.log("=== GROUPING SOS CALLS BY SECTOR ===");
emergencyCalls.forEach(call => {
  grid.addCall(call);
  console.log(`Mapped [${call.id}] to Sector: ${grid.getSectorKey(call.lat, call.lng)}`);
});

// Query sector for downtown district
const targetLat = 13.0828;
const targetLng = 80.2708;
console.log(`\nQuerying active emergencies near (${targetLat}, ${targetLng})...`);
const localCalls = grid.getCallsInSector(targetLat, targetLng);

console.log(`🚨 Found ${localCalls.length} emergency(ies) in this sector:`);
localCalls.forEach(c => console.log(` - [${c.id}] ${c.type}: ${c.details}`));