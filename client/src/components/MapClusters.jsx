import React, { useEffect, useState } from 'react';
import {
  GoogleMap,
  Polygon,
  InfoWindow,
} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
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
            fillColor: '#ff0000',
            fillOpacity: 0.6,
            strokeColor: '#000000',
            strokeOpacity: 1,
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
  );
}