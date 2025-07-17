import React, { useEffect, useState } from 'react';
import {
  GoogleMap,
  LoadScript,
  Polygon,
  InfoWindow,
} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const center = clusters.length > 0 ? {
    lat: clusters[0].center[0],
    lng: clusters[0].center[1],
  } : { lat: 37.4221, lng: -122.0841 };

const libraries = ['visualization'];

export default function MapClusters() {
  const [clusters, setClusters] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchClusters = async () => {
      const res = await fetch('http://localhost:3001/api/clusters');
      const data = await res.json();
      setClusters(data);
    };

    fetchClusters();
  }, []);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY} libraries={libraries}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
        {clusters.map((cluster, i) => (
          <Polygon
            key={i}
            paths={cluster.polygon.map(([lat, lng]) => ({ lat, lng }))}
            options={{
              fillColor: '#2196f3',
              fillOpacity: 0.35,
              strokeColor: '#1e88e5',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              clickable: true,
            }}
            onClick={() => setSelected(cluster)}
          />
        ))}

        {selected && (
          <InfoWindow
            position={{ lat: selected.center[0], lng: selected.center[1] }}
            onCloseClick={() => setSelected(null)}
          >
            <div>
              <p><strong>Cluster #{selected.cluster}</strong></p>
              <p>Total Earnings: ${selected.total_earnings.toFixed(2)}</p>
              <p>Average Tip: ${selected.avg_tip.toFixed(2)}</p>
              <p>Most Active Hour: {selected.active_hour}:00</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}