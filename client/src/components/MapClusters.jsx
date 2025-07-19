import React, { useEffect, useState } from 'react';
import {
  GoogleMap,
  Polygon,
  InfoWindow,
} from '@react-google-maps/api';
import '../ModernUI.css';

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '1.5rem',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.2)',
  overflow: 'hidden',
};

const center = { lat: 37.7764, lng: -122.4160 };

export default function MapClusters() {
  const [clusters, setClusters] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/clusters"); 
        const data = await res.json();
        if (Array.isArray(data)) {
          setClusters(data);
        } else {
          console.warn("Unexpected cluster format", data);
          setClusters([]);
        }
      } catch (err) {
        console.error("Failed to fetch clusters:", err);
      }
    };
    fetchClusters();
  }, []);

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
      {clusters.map((cluster, i) => (
        <Polygon
          key={i}
          paths={cluster.polygon.map(([lat, lng]) => ({ lat, lng }))}
          options={{
            fillColor: selected && selected.cluster === cluster.cluster ? '#a78bfa' : '#ff0000',
            fillOpacity: 0.6,
            strokeColor: selected && selected.cluster === cluster.cluster ? '#6366f1' : '#000000',
            strokeOpacity: 1,
            strokeWeight: 2,
            clickable: true,
            zIndex: selected && selected.cluster === cluster.cluster ? 2 : 1,
          }}
          onClick={() => setSelected(cluster)}
          className={selected && selected.cluster === cluster.cluster ? 'modern-glow' : ''}
        />
      ))}

      {selected && (
        <InfoWindow
          position={{ lat: selected.center[0], lng: selected.center[1] }}
          onCloseClick={() => setSelected(null)}
        >
          <div className="modern-glass-infowindow">
            <p><strong>Cluster #{selected.cluster}</strong></p>
            <p>💰 Total Earnings: <b>${selected.total_earnings.toFixed(2)}</b></p>
            <p>💸 Average Tip: <b>${selected.avg_tip.toFixed(2)}</b></p>
            <p>⏰ Most Active Hour: <b>{selected.active_hour}:00</b></p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}