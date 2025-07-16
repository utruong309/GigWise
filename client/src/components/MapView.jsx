import React, { useState } from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker,
  HeatmapLayer,
} from '@react-google-maps/api';

const containerStyle = { //map size
  width: '100%',
  height: '500px',
};

const center = {
  lat: 37.4221, //default center Google HQ
  lng: -122.0841,
};

const MapView = ({ deliveries }) => {
  const [mode, setMode] = useState('marker');

  const heatmapData = deliveries.map((d) => ({
    location: new window.google.maps.LatLng(d.lat, d.lng),
    weight: d.tip,
  }));

  return (
    <div>
      <button
        onClick={() => setMode((prev) => (prev === 'marker' ? 'heatmap' : 'marker'))}
        style={{ marginBottom: '1rem' }}
      >
        Switch to {mode === 'marker' ? 'Heatmap' : 'Marker'} View
      </button>

      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
        libraries={['visualization']}
      >
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
          {mode === 'marker'
            ? deliveries.map((d, i) => (
                <Marker
                  key={i}
                  position={{ lat: d.lat, lng: d.lng }}
                  title={`Tip: $${d.tip} | Platform: ${d.platform}`}
                />
              ))
            : <HeatmapLayer data={heatmapData} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapView;