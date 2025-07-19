import React, { useState } from 'react';
import {
  GoogleMap,
  Marker,
  HeatmapLayer,
} from '@react-google-maps/api';
import '../ModernUI.css';

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '1.5rem',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.2)',
  overflow: 'hidden',
};

const center = {
  lat: 37.4221, 
  lng: -122.0841,
};

const MapView = ({ deliveries }) => {
  const [mode, setMode] = useState('marker');

  const validDeliveries = Array.isArray(deliveries)
    ? deliveries.filter((d) => d.lat && d.lng)
    : [];

  const heatmapData = validDeliveries.map((d) => ({
    location: new window.google.maps.LatLng(d.lat, d.lng),
    weight: d.tip,
  }));

  return (
    <div className="modern-map-container">
      <button
        onClick={() => setMode((prev) => (prev === 'marker' ? 'heatmap' : 'marker'))}
        className="modern-floating-toggle"
      >
        {mode === 'marker' ? 'Heatmap' : 'Marker'} View
      </button>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
      >
        {mode === 'marker' ? (
          validDeliveries.map((d, i) => (
            <Marker
              key={i}
              position={{ lat: d.lat, lng: d.lng }}
              title={`Tip: $${d.tip} | Platform: ${d.platform}`}
              icon={{
                url: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                scaledSize: new window.google.maps.Size(32, 32),
              }}
            />
          ))
        ) : (
          <HeatmapLayer data={heatmapData} />
        )}
      </GoogleMap>
    </div>
  );
};

export default MapView;