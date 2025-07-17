import React, { useState } from 'react';
import {
  GoogleMap,
  Marker,
  HeatmapLayer,
} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
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
    <div>
      <button
        onClick={() =>
          setMode((prev) => (prev === 'marker' ? 'heatmap' : 'marker'))
        }
        style={{ marginBottom: '1rem' }}
      >
        Switch to {mode === 'marker' ? 'Heatmap' : 'Marker'} View
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