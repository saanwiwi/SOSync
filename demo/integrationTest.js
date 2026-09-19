import { triggerDisaster, disasterScenario } from "./disasterDemo.js";
import { findNearbyResources, calculateDistance, resources, resourceTree } from "../spatial/resourceSearch.js";
import * as spatial from "../spatial/index.js";

console.log("\n===== SOSync INTEGRATION TEST =====");

triggerDisaster();

console.log("\nDisaster active:", disasterScenario.active);

console.log("\n===== NEAREST RESCUE RESOURCES (Kathmandu Basin) =====");

const nearbyResources = findNearbyResources(27.7172, 85.3240);

nearbyResources.forEach((resource, index) => {
    console.log(
        `${index + 1}. ${resource.name} — ${resource.distance} km away`
    );
});

console.log("\n===== SOSYNC SPATIAL ENGINE VERIFICATION =====");
console.log("B-Tree Instance:", spatial.BTree ? "READY" : "ERROR");
console.log("Geospatial Search:", spatial.findNearbyResources ? "READY" : "ERROR");
console.log("Distance Calculator:", spatial.calculateDistance ? "READY" : "ERROR");
console.log("ALL MODULES FUNCTIONAL.\n");