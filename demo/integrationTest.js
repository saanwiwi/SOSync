const { triggerDisaster, disasterScenario } = require("./disasterDemo");
const { findNearbyResources } = require("../spatial/resourceSearch");
const spatial = require("../spatial");
console.log("\n===== SOSync INTEGRATION TEST =====");

triggerDisaster();

console.log("\nDisaster active:", disasterScenario.active);

console.log("\n===== NEAREST RESCUE RESOURCES =====");

const nearbyResources = findNearbyResources(12.9716, 77.5946);

nearbyResources.forEach((resource, index) => {
    console.log(
        `${index + 1}. ${resource.name} — ${resource.distance} km away`
    );
});
console.log("\n===== SOSYNC SPATIAL ENGINE =====");

console.log("B-Tree:", spatial.BTree ? "READY" : "ERROR");
console.log("Geospatial Search:", spatial.findNearbyResources ? "READY" : "ERROR");
console.log("Distance Calculator:", spatial.calculateDistance ? "READY" : "ERROR");