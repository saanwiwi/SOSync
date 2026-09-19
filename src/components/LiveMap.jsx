import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SUPPLY_DEPOTS } from '../services/SpatialEngine';
import { triageEngine } from '../services/TriageEngine';

export default function LiveMap({ routePath, showFlood = true }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const polylineRef = useRef(null);
  const vehicleMarkerRef = useRef(null);
  const floodLayerRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!mapInstanceRef.current && mapContainerRef.current) {
      // Initialize Leaflet Map centered on Kathmandu Basin
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([27.7172, 85.324], 13);

      // Tactical Dark Matter map tiles (Dark Blue tint)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      mapInstanceRef.current = map;

      // Add Supply Depots as green cross markers
      SUPPLY_DEPOTS.forEach((depot) => {
        const depotIcon = L.divIcon({
          className: 'depot-marker',
          html: `<div style="background-color: #022c22; border: 2px solid #10b981; color: #34d399; border-radius: 8px; padding: 2px 6px; font-family: monospace; font-size: 9px; font-weight: bold; white-space: nowrap; box-shadow: 0 0 10px rgba(16,185,129,0.5);">🏥 ${depot.name.split(' ')[0]}</div>`,
          iconSize: [80, 20],
          iconAnchor: [40, 10],
        });
        L.marker([depot.lat, depot.lng], { icon: depotIcon })
          .addTo(map)
          .bindPopup(`<b>${depot.name}</b><br/>Blood Units: ${depot.bloodUnits}<br/>Fleet: ${depot.fleet} Ambulances`);
      });

      // Add Triage Casualties
      triageEngine.getAllSorted().slice(0, 4).forEach((sos) => {
        const sosIcon = L.divIcon({
          className: 'sos-marker',
          html: `<div style="background-color: #7f1d1d; border: 2px solid #ef4444; color: #fecaca; border-radius: 9999px; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; box-shadow: 0 0 12px rgba(239,68,68,0.8); animation: pulse 1.5s infinite;">SOS</div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });
        L.marker([sos.lat, sos.lng], { icon: sosIcon })
          .addTo(map)
          .bindPopup(`<b>${sos.id} (${sos.locationName})</b><br/>Injury: ${sos.injury}<br/>Urgency Score: ${sos.score}`);
      });
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Visual Flood Simulation Layer (Bagmati River Basin Water Spread)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (floodLayerRef.current) {
      floodLayerRef.current.remove();
    }

    if (showFlood) {
      // Coordinates tracing Bagmati & Bishnumati flood zones
      const floodCoords = [
        [27.725, 85.312],
        [27.718, 85.316],
        [27.705, 85.318],
        [27.695, 85.321],
        [27.682, 85.325],
        [27.674, 85.328],
        [27.672, 85.334],
        [27.685, 85.331],
        [27.701, 85.326],
        [27.712, 85.322],
        [27.722, 85.318],
      ];

      floodLayerRef.current = L.polygon(floodCoords, {
        color: '#0284c7', // Deep blue flood perimeter
        fillColor: '#064e3b', // Dark green water surge overlay
        fillOpacity: 0.45,
        weight: 3,
        dashArray: '6, 6',
      }).addTo(mapInstanceRef.current);

      floodLayerRef.current.bindPopup(
        "<b>⚠️ BAGMATI RIVER FLOOD ZONE</b><br/>Surge Depth: +1.2M<br/>Status: Submerged / Inundated"
      );
    }
  }, [showFlood]);

  // Route Polyline & Animated Vehicle Marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (polylineRef.current) polylineRef.current.remove();
    if (vehicleMarkerRef.current) vehicleMarkerRef.current.remove();
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    if (routePath && routePath.length > 0) {
      const latLngs = routePath.map((coord) => [coord[1], coord[0]]);

      polylineRef.current = L.polyline(latLngs, {
        color: '#facc15', // High-visibility amber route
        weight: 5,
        opacity: 0.95,
        dashArray: '8, 8',
        lineCap: 'round',
      }).addTo(mapInstanceRef.current);

      // Create Animated Vehicle Marker (Ambulance Unit)
      const vehicleIcon = L.divIcon({
        className: 'vehicle-marker',
        html: `<div style="background-color: #022c22; border: 2px solid #facc15; border-radius: 9999px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 0 15px rgba(250,204,21,0.8);">🚑</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      vehicleMarkerRef.current = L.marker(latLngs[0], { icon: vehicleIcon }).addTo(mapInstanceRef.current);

      // Animate vehicle smoothly along path
      let progress = 0;
      const speed = 0.004;

      const animateVehicle = () => {
        progress += speed;
        if (progress >= latLngs.length - 1) progress = 0;

        const segmentIndex = Math.floor(progress);
        const nextIndex = Math.min(segmentIndex + 1, latLngs.length - 1);
        const t = progress - segmentIndex;

        const p1 = latLngs[segmentIndex];
        const p2 = latLngs[nextIndex];

        if (p1 && p2) {
          const currentLat = p1[0] + (p2[0] - p1[0]) * t;
          const currentLng = p1[1] + (p2[1] - p1[1]) * t;
          if (vehicleMarkerRef.current) {
            vehicleMarkerRef.current.setLatLng([currentLat, currentLng]);
          }
        }

        animationFrameRef.current = requestAnimationFrame(animateVehicle);
      };

      animateVehicle();
      mapInstanceRef.current.fitBounds(polylineRef.current.getBounds(), { padding: [60, 60] });
    }
  }, [routePath]);

  return <div ref={mapContainerRef} className="w-full h-full min-h-[440px]" />;
}