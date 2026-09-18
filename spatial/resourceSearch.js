const { BTree } = require("./btree");
const { encodeGeohash } = require("./geohash");

const resources = [
    {
        name: "Medical Kit",
        latitude: 12.9716,
        longitude: 77.5946
    },
    {
        name: "Water Supply",
        latitude: 12.9750,
        longitude: 77.5900
    },
    {
        name: "Ambulance",
        latitude: 12.9680,
        longitude: 77.6000
    }
];

for (const resource of resources) {
    resource.geohash = encodeGeohash(
        resource.latitude,
        resource.longitude
    );
}

console.log(resources);
const tree = new BTree();
for (const resource of resources) {
    tree.insert(resource.geohash, resource);
}
const disasterLocation = {
    latitude: 12.9716,
    longitude: 77.5946
};

const disasterGeohash = encodeGeohash(
    disasterLocation.latitude,
    disasterLocation.longitude
);

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function findNearbyResources(latitude, longitude, maxDistance = 2) {
    const nearby = [];

    for (const resource of resources) {
        const distance = calculateDistance(
            latitude,
            longitude,
            resource.latitude,
            resource.longitude
        );

        if (distance <= maxDistance) {
            nearby.push({
                ...resource,
                distance: distance.toFixed(2)
            });
        }
    }

    return nearby.sort((a, b) => a.distance - b.distance);
}
const nearby = findNearbyResources(
    disasterLocation.latitude,
    disasterLocation.longitude
);
console.log("\n=== NEARBY RESOURCES ===");

for (const resource of nearby) {
    console.log(
        `${resource.name} — ${resource.distance} km away`
    );
}
console.log("\n=== B-TREE LOOKUP ===");

for (const resource of resources) {
    const found = tree.search(resource.geohash);

    console.log(
        `${resource.name} → ${found ? "FOUND" : "NOT FOUND"}`
    );
}
console.log("\n=== OMNIGRID SPATIAL ENGINE ===");
console.log("Disaster Location:");
console.log(
    disasterLocation.latitude,
    disasterLocation.longitude
);

console.log("\nNearest Resources:");

nearby.forEach((resource, index) => {
    console.log(
        `${index + 1}. ${resource.name} | ${resource.distance} km`
    );
});
module.exports = {
    findNearbyResources,
    calculateDistance
};