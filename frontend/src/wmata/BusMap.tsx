// BusMap.js
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const BusMap = ({ stops }: { stops: any[] }) => {
  const mapRef = useRef<L.Map | L.LayerGroup<any> | null>(null);

  useEffect(() => {
    // Function to check if stops data is valid
    const isValidStopsData = () => {
      if (!stops || stops.length === 0) return false;
      for (const stop of stops) {
        if (typeof stop.Lat !== 'number' || typeof stop.Lon !== 'number') {
          return false; // Invalid latitude or longitude
        }
      }
      return true;
    };

    if (!isValidStopsData()) {
      return; // No valid stops data to render
    }

    mapRef.current = L.map('map').setView([stops[0].Lat, stops[0].Lon], 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CartoDB</a>'
}).addTo(mapRef.current);


    // Add markers for each bus stop
    stops.forEach((stop, index) => {
    if (mapRef.current) {
        L.marker([stop.Lat, stop.Lon]).addTo(mapRef.current).bindPopup(`Stop ${index + 1}: ${stop.Name}`);
    }
    });

    // Draw polylines between bus stops
    const latLngs = stops.map(stop => [stop.Lat, stop.Lon]);
    const polyline = L.polyline(latLngs, { color: 'blue' }).addTo(mapRef.current);

    // Fit map to bounds of polyline
    mapRef.current.fitBounds(polyline.getBounds());

    return () => {
    if (mapRef.current) {
        mapRef.current.remove();
    }
    };
  }, [stops]);

  return <div id="map" className="w-full h-96" />;
};

export default BusMap;
