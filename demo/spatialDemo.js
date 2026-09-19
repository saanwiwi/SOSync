const { findNearbyResources } = require("../spatial/resourceSearch");

console.log("\n================================");
console.log("        SOSYNC SPATIAL ENGINE");
console.log("================================");

const disasterLocation = {
	latitude: 12.9716,
	longitude: 77.5946
};

console.log("\n📍 Disaster Location:");
console.log(
	disasterLocation.latitude,
	disasterLocation.longitude
);

console.log("\n🔎 Searching nearby rescue resources...");

const resources = findNearbyResources(
	disasterLocation.latitude,
	disasterLocation.longitude
);

console.log("\n=== NEAREST RESOURCES ===");

resources.forEach((resource, index) => {
	console.log(
		`${index + 1}. ${resource.name} | ${resource.distance} km away`
	);
});

console.log("\n⚡ Spatial search completed.");
console.log("SOSync Spatial Engine: READY");
