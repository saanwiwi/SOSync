const fs = require("fs");
const path = require("path");
const proj4 = require("proj4");

const inputPath = path.join(
  process.cwd(),
  "data",
  "imd_subdivisions.json"
);

const outputPath = path.join(
  process.cwd(),
  "data",
  "imd_subdivisions_wgs84.json"
);

const sourceProjection = "EPSG:32644";
const targetProjection = "EPSG:4326";

console.log("Reading IMD subdivision boundaries...");

const input = JSON.parse(
  fs.readFileSync(inputPath, "utf-8")
);

function convertCoordinates(coordinates) {
  if (
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    typeof coordinates[0] === "number" &&
    typeof coordinates[1] === "number"
  ) {
    return proj4(
      sourceProjection,
      targetProjection,
      coordinates
    );
  }

  return coordinates.map(convertCoordinates);
}

const converted = {
  ...input,
  crs: {
    type: "name",
    properties: {
      name: "urn:ogc:def:crs:OGC:1.3:CRS84",
    },
  },
  features: input.features.map((feature) => ({
    ...feature,
    geometry: {
      ...feature.geometry,
      coordinates: convertCoordinates(
        feature.geometry.coordinates
      ),
    },
  })),
};

fs.writeFileSync(
  outputPath,
  JSON.stringify(converted)
);

console.log("");
console.log("Conversion complete!");
console.log("");
console.log(
  `Features converted: ${converted.features.length}`
);
console.log(
  `Output: ${outputPath}`
);