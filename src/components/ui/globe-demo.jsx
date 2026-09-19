import React from "react";
import { motion } from "motion/react";
import { World } from "./globe";

export default function GlobeDemo() {
  const globeConfig = {
    pointSize: 4,
    globeColor: "#020817", // Dark blue background
    showAtmosphere: true,
    atmosphereColor: "#10b981", // Dark green / emerald glow
    atmosphereAltitude: 0.12,
    emissive: "#03152e",
    emissiveIntensity: 0.3,
    shininess: 0.9,
    polygonColor: "rgba(16, 185, 129, 0.7)", // Dark green continents
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#34d399",
    pointLight: "#facc15",
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 27.7172, lng: 85.324 }, // Centered on Kathmandu
    autoRotate: true,
    autoRotateSpeed: 0.5, // Smooth, gentle rotation
  };

  const colors = ["#10b981", "#34d399", "#38bdf8", "#facc15"];

  // Telemetry arcs connecting Kathmandu to global disaster nodes
  const sampleArcs = [
    { order: 1, startLat: 27.7172, startLng: 85.324, endLat: 28.6139, endLng: 77.209, color: colors[0] }, // Delhi
    { order: 1, startLat: 27.7172, startLng: 85.324, endLat: 35.6762, endLng: 139.6503, color: colors[1] }, // Tokyo
    { order: 2, startLat: 27.7172, startLng: 85.324, endLat: 46.2044, endLng: 6.1432, color: colors[2] }, // Geneva (UN OCHA)
    { order: 2, startLat: 27.7172, startLng: 85.324, endLat: 51.5074, endLng: -0.1278, color: colors[3] }, // London
    { order: 3, startLat: 27.7172, startLng: 85.324, endLat: 38.9072, endLng: -77.0369, color: colors[0] }, // Washington DC
    { order: 3, startLat: 27.7172, startLng: 85.324, endLat: 1.3521, endLng: 103.8198, color: colors[1] }, // Singapore
    { order: 4, startLat: 27.7172, startLng: 85.324, endLat: -33.8688, endLng: 151.2093, color: colors[2] }, // Sydney
  ];

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <World data={sampleArcs} globeConfig={globeConfig} />
    </div>
  );
}
