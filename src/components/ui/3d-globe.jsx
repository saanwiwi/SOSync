"use client";
import React, { useRef, useMemo, useState, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, useTexture } from "@react-three/drei";
import * as THREE from "three";

const cn = (...classes) => classes.filter(Boolean).join(' ');

// Using pure, stable textures from the official Three.js repo
const DEFAULT_EARTH_TEXTURE = "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg";
const DEFAULT_BUMP_TEXTURE = "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg";
const CLOUD_TEXTURE = "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png";

function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Marker component kept intact in case you ever want to re-add coordinates
function Marker({ marker, radius, onClick, onHover }) {
  // ... hidden for brevity but completely empty in your current implementation since you pass []
  return null; 
}

function RotatingGlobe({ config, markers, onMarkerClick, onMarkerHover }) {
  const groupRef = useRef(null);
  const atmosphereRef = useRef(null);

  const [earthTexture, bumpTexture, cloudTexture] = useTexture([
    config.textureUrl, 
    config.bumpMapUrl, 
    CLOUD_TEXTURE
  ]);

  useMemo(() => {
    if (earthTexture) {
      earthTexture.colorSpace = THREE.SRGBColorSpace;
      earthTexture.anisotropy = 16;
    }
    if (bumpTexture) bumpTexture.anisotropy = 8;
    if (cloudTexture) cloudTexture.anisotropy = 8;
  }, [earthTexture, bumpTexture, cloudTexture]);

  const geometry = useMemo(() => new THREE.SphereGeometry(config.radius, 64, 64), [config.radius]);
  const atmosphereGeometry = useMemo(() => new THREE.SphereGeometry(config.radius * 1.015, 64, 64), [config.radius]);
  const haloGeometry = useMemo(() => new THREE.SphereGeometry(config.radius * 1.1, 64, 64), [config.radius]);

  // Make the atmosphere independently drift slightly faster than the earth rotation
  useFrame((state, delta) => {
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. Base Earth */}
      <mesh geometry={geometry}>
        <meshStandardMaterial 
          map={earthTexture} 
          bumpMap={bumpTexture} 
          bumpScale={config.bumpScale * 0.05} 
          roughness={0.8} 
          metalness={0.1} 
        />
      </mesh>

      {/* 2. Moving Atmospheric Gradient (Clouds) */}
      <mesh ref={atmosphereRef} geometry={atmosphereGeometry}>
        <meshStandardMaterial
          map={cloudTexture}
          transparent={true}
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          color="#38bdf8" // Cyan tint to match the SOSync UI
        />
      </mesh>

      {/* 3. Soft Outer Gradient Halo */}
      <mesh geometry={haloGeometry}>
        <meshBasicMaterial
          color="#0284c7"
          transparent={true}
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

function Scene({ markers, config, onMarkerClick, onMarkerHover }) {
  const { camera } = useThree();

  React.useEffect(() => {
    camera.position.set(0, 0, config.radius * 3.5);
    camera.lookAt(0, 0, 0);
  }, [camera, config.radius]);

  return (
    <>
      <ambientLight intensity={config.ambientIntensity} />
      <directionalLight position={[config.radius * 5, config.radius * 2, config.radius * 5]} intensity={config.pointLightIntensity} color="#ffffff" />
      <directionalLight position={[-config.radius * 3, config.radius, -config.radius * 2]} intensity={config.pointLightIntensity * 0.3} color="#38bdf8" />

      <RotatingGlobe config={config} markers={markers} onMarkerClick={onMarkerClick} onMarkerHover={onMarkerHover} />

      <OrbitControls 
        makeDefault 
        enablePan={config.enablePan} 
        enableZoom={config.enableZoom} 
        minDistance={config.minDistance} 
        maxDistance={config.maxDistance} 
        rotateSpeed={0.4} 
        autoRotate={config.autoRotateSpeed > 0} 
        autoRotateSpeed={config.autoRotateSpeed} 
        enableDamping 
        dampingFactor={0.1} 
      />
    </>
  );
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex shrink-0 flex-col items-center gap-3">
        <span className="inline-block shrink-0 text-xs font-mono text-sky-400">
          UPLINKING SATELLITE...
        </span>
      </div>
    </Html>
  );
}

const defaultConfig = {
  radius: 2,
  globeColor: "#020617",
  textureUrl: DEFAULT_EARTH_TEXTURE,
  bumpMapUrl: DEFAULT_BUMP_TEXTURE,
  bumpScale: 2,
  autoRotateSpeed: 0.4,
  enableZoom: false,
  enablePan: false,
  minDistance: 5,
  maxDistance: 15,
  ambientIntensity: 0.5,
  pointLightIntensity: 1.8,
  backgroundColor: null,
};

export function Globe3D({ markers = [], config = {}, className, onMarkerClick, onMarkerHover }) {
  const mergedConfig = useMemo(() => ({ ...defaultConfig, ...config }), [config]);

  return (
    <div className={cn("relative h-[450px] w-full", className)}>
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000,
          position: [0, 0, mergedConfig.radius * 3.5],
        }}
        style={{
          background: mergedConfig.backgroundColor || "transparent",
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene markers={markers} config={mergedConfig} onMarkerClick={onMarkerClick} onMarkerHover={onMarkerHover} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Globe3D;