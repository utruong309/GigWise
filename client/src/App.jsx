import React, { useEffect, useState } from "react";
import { useAuth } from "./firebase/context.jsx";
import './ModernUI.css';
import DeliveryUploader from "./components/DeliveryUploader.jsx";
import MapView from "./components/MapView.jsx";
import MapClusters from "./components/MapClusters.jsx";
import { LoadScript } from "@react-google-maps/api";
import AIDeliveryAssistant from "./components/AIDeliveryAssistant.jsx";
import logo from "./assets/logo.png";

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
    <div className="modern-app-bg">
      <div className="modern-header">
        <img src={logo} alt="GigWise Logo" className="modern-logo" />
        <span className="modern-title">GigWise</span>
        {user && (
          <div className="modern-user-info">
            <span className="modern-user-name">{user.displayName}</span>
            <button onClick={logout} className="modern-logout-btn">Logout</button>
          </div>
        )}
      </div>
      <div className="modern-main-content">
        {user ? (
          <>
            <div className="modern-card-row">
              <DeliveryUploader onUploadComplete={fetchDeliveries} />
              <div className="modern-map-card">
                <div className="modern-map-controls">
                  <button
                    onClick={() => setViewMode((prev) => prev === "marker" ? "cluster" : "marker")}
                    className="modern-toggle-btn"
                  >
                    {viewMode === "marker" ? "Cluster View" : "Map View"}
                  </button>
                  <button
                    onClick={runClustering}
                    className="modern-action-btn"
                    disabled={loadingClusters}
                  >
                    {loadingClusters ? "Clustering..." : "Run Clustering"}
                  </button>
                  {successMessage && (
                    <span className="modern-success-msg">{successMessage}</span>
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
              </div>
            </div>
            <AIDeliveryAssistant />
          </>
        ) : (
          <div className="modern-login-card">
            <h1 className="modern-login-title">Welcome to GigWise</h1>
            <button onClick={login} className="modern-google-btn">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="modern-google-icon" />
              Sign in with Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;