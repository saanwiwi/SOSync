import React, { useEffect, useRef, useState, useMemo } from "react";
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { useThree, Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "../../data/globe.json";

extend({ ThreeGlobe });

const RING_PROPAGATION_SPEED = 2;
const aspect = 1.2;
const cameraZ = 300;

export function Globe({ globeConfig, data = [] }) {
  const globeRef = useRef(null);
  const groupRef = useRef();
  const [isInitialized, setIsInitialized] = useState(false);

  const defaultProps = useMemo(() => ({
    pointSize: 2,
    atmosphereColor: "#34d399", // Emerald glow
    showAtmosphere: true,
    atmosphereAltitude: 0.15,
    polygonColor: "rgba(16, 185, 129, 0.5)", // Dark green/emerald continents
    globeColor: "#020817", // Dark blue background
    emissive: "#041e3a", // Deep oceanic blue
    emissiveIntensity: 0.2,
    shininess: 0.9,
    arcTime: 1800,
    arcLength: 0.9,
    rings: 2,
    maxRings: 3,
    ...globeConfig,
  }), [globeConfig]);

  // Initialize globe only once
  useEffect(() => {
    if (!globeRef.current && groupRef.current) {
      try {
        globeRef.current = new ThreeGlobe();
        groupRef.current.add(globeRef.current);
        setIsInitialized(true);
      } catch (e) {
        console.warn("ThreeGlobe initialization fallback:", e);
      }
    }
  }, []);

  // Material setup
  useEffect(() => {
    if (!globeRef.current || !isInitialized) return;

    try {
      const globeMaterial = globeRef.current.globeMaterial();
      globeMaterial.color = new Color(defaultProps.globeColor);
      globeMaterial.emissive = new Color(defaultProps.emissive);
      globeMaterial.emissiveIntensity = defaultProps.emissiveIntensity;
      globeMaterial.shininess = defaultProps.shininess;
    } catch (e) {
      console.warn("Globe material error:", e);
    }
  }, [isInitialized, defaultProps]);

  // Arcs and polygons setup
  useEffect(() => {
    if (!globeRef.current || !isInitialized) return;

    try {
      const arcs = data || [];
      const points = [];

      arcs.forEach((arc) => {
        points.push({
          size: defaultProps.pointSize,
          order: arc.order,
          color: arc.color,
          lat: arc.startLat,
          lng: arc.startLng,
        });
        points.push({
          size: defaultProps.pointSize,
          order: arc.order,
          color: arc.color,
          lat: arc.endLat,
          lng: arc.endLng,
        });
      });

      if (countries && countries.features) {
        globeRef.current
          .hexPolygonsData(countries.features)
          .hexPolygonResolution(3)
          .hexPolygonMargin(0.7)
          .showAtmosphere(defaultProps.showAtmosphere)
          .atmosphereColor(defaultProps.atmosphereColor)
          .atmosphereAltitude(defaultProps.atmosphereAltitude)
          .hexPolygonColor(() => defaultProps.polygonColor);
      }

      if (arcs.length > 0) {
        globeRef.current
          .arcsData(arcs)
          .arcStartLat((d) => d.startLat)
          .arcStartLng((d) => d.startLng)
          .arcEndLat((d) => d.endLat)
          .arcEndLng((d) => d.endLng)
          .arcColor((e) => e.color)
          .arcAltitude((e) => e.arcAlt || 0.25)
          .arcStroke(() => 0.4)
          .arcDashLength(defaultProps.arcLength)
          .arcDashInitialGap((e) => e.order * 0.5)
          .arcDashGap(10)
          .arcDashAnimateTime(() => defaultProps.arcTime);

        globeRef.current
          .pointsData(points)
          .pointColor((e) => e.color)
          .pointsMerge(true)
          .pointAltitude(0.02)
          .pointRadius(2.5);
      }
    } catch (e) {
      console.warn("Globe data setup warning:", e);
    }
  }, [isInitialized, data, defaultProps]);

  return <group ref={groupRef} />;
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    gl.setSize(size.width, size.height);
    gl.setClearColor(0x020817, 0); // Transparent canvas on dark blue
  }, [gl, size]);

  return null;
}

export function World({ globeConfig = {}, data = [] }) {
  const scene = useMemo(() => {
    const s = new Scene();
    s.fog = new Fog(0x020817, 400, 2000);
    return s;
  }, []);

  const config = {
    pointSize: 3,
    globeColor: "#020817",
    showAtmosphere: true,
    atmosphereColor: "#10b981", // Emerald halo
    atmosphereAltitude: 0.15,
    emissive: "#041a33", // Deep navy blue
    emissiveIntensity: 0.25,
    shininess: 0.9,
    polygonColor: "rgba(16, 185, 129, 0.7)", // Emerald green continents
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#34d399",
    pointLight: "#facc15",
    arcTime: 1800,
    arcLength: 0.8,
    rings: 2,
    maxRings: 3,
    initialPosition: { lat: 27.7172, lng: 85.324 }, // Centered on Kathmandu!
    autoRotate: true,
    autoRotateSpeed: 0.5, // GENTLE, STABLE SPEED (NO CRAZY SPINNING)
    ...globeConfig,
  };

  return (
    <Canvas scene={scene} camera={new PerspectiveCamera(50, aspect, 180, 1800)}>
      <WebGLRendererConfig />
      <ambientLight color={config.ambientLight} intensity={0.7} />
      <directionalLight
        color={config.directionalLeftLight}
        position={new Vector3(-400, 100, 400)}
        intensity={1.2}
      />
      <directionalLight
        color={config.directionalTopLight}
        position={new Vector3(-200, 500, 200)}
        intensity={0.8}
      />
      <pointLight
        color={config.pointLight}
        position={new Vector3(0, 300, 200)}
        intensity={0.6}
      />
      <Globe globeConfig={config} data={data} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={0.5} // Gentle smooth auto-rotation
        autoRotate={true}
        enableDamping={true}
        dampingFactor={0.05}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}
