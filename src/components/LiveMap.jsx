import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function LiveMap({ routePath }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const polylineRef = useRef(null);

  useEffect(() => {
    if (!mapInstanceRef.current) {
      // Initialize Leaflet Map centered on Kathmandu Basin
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        zoomControl: false
      }).setView([27.7172, 85.3240], 13);

      // Dark tactical map tiles (CartoDB Dark Matter)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(mapInstanceRef.current);
    }
  }, []);

  // Update route polyline whenever routePath changes from the backend engine
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing route line if any
    if (polylineRef.current) {
      polylineRef.current.remove();
    }

    if (routePath && routePath.length > 0) {
      // Leaflet expects [lat, lng], but our engine outputs [lng, lat]
      const latLngs = routePath.map(coord => [coord[1], coord[0]]);

      polylineRef.current = L.polyline(latLngs, {
        color: '#facc15', // High-visibility amber/yellow matching our theme
        weight: 5,
        opacity: 0.9,
        dashArray: '10, 10', // Dashed tactical emergency route line
        lineCap: 'round'
      }).addTo(mapInstanceRef.current);

      // Fit map bounds to the calculated path
      mapInstanceRef.current.fitBounds(polylineRef.current.getBounds(), { padding: [50, 50] });
    }
  }, [routePath]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
}