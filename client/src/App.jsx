import React, { useEffect, useState } from "react";
import { useAuth } from "./firebase/context.jsx";
import './App.css';
import DeliveryUploader from "./components/DeliveryUploader";
import MapView from "./components/MapView";
import MapClusters from "./components/MapClusters.jsx";
import { LoadScript } from "@react-google-maps/api";
import AIDeliveryAssistant from './components/AIDeliveryAssistant.jsx'; 
import DeliveryRecommendations from './components/DeliveryRecommendations.jsx';

const libraries = ['visualization'];

function App() {
  const { user, login, logout } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [viewMode, setViewMode] = useState("marker");
  const [loadingClusters, setLoadingClusters] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchDeliveries = async () => {
    try {
      const token = await user.getIdToken();
      const res = await fetch("http://localhost:3001/api/deliveries/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDeliveries(data);
    } catch (err) {
      console.error("Failed to fetch deliveries:", err);
    }
  };

  const runClustering = async () => {
    try {
      setLoadingClusters(true);
      setSuccessMessage("");
      const token = await user.getIdToken();
      const res = await fetch("http://localhost:3001/api/clusters/run", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSuccessMessage(data.message || "Clusters updated!");
    } catch (err) {
      console.error("Clustering failed:", err);
      setSuccessMessage("Failed to update clusters.");
    } finally {
      setLoadingClusters(false);
    }
  };

  useEffect(() => {
    if (user) fetchDeliveries();
  }, [user]);

  return (
    <div className="text-center p-8 font-sans">
      {user ? (
        <>
          <h2 className="text-2xl font-bold">Welcome, {user.displayName}</h2>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>

          <hr className="my-8" />
          <DeliveryUploader onUploadComplete={fetchDeliveries} />

          <hr className="my-8" />
          <div className="mb-4">
            <button
              onClick={() =>
                setViewMode((prev) =>
                  prev === "marker" ? "cluster" : "marker"
                )
              }
              className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
            >
              Toggle to {viewMode === "marker" ? "Cluster View" : "Map View"}
            </button>

            <button
              onClick={runClustering}
              className="bg-green-600 text-white px-4 py-2 rounded"
              disabled={loadingClusters}
            >
              {loadingClusters ? "Clustering..." : "Run Clustering"}
            </button>

            {successMessage && (
              <p className="mt-2 text-green-600 font-medium">
                {successMessage}
              </p>
            )}
          </div>

          <LoadScript
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY}
            libraries={libraries}
          >
            {viewMode === "marker" ? (
              <MapView deliveries={deliveries} />
            ) : (
              <MapClusters />
            )}
          </LoadScript>

          <hr className="my-8" />
          <AIDeliveryAssistant /> 

          <hr className="my-8" />
          <DeliveryRecommendations />
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4">GigWise</h1>
          <button
            onClick={login}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Sign in with Google
          </button>
        </>
      )}
    </div>
  );
}

export default App;