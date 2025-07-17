import React, { useEffect, useState } from "react";
import { useAuth } from "./firebase/context.jsx";
import './App.css';
import DeliveryUploader from "./components/DeliveryUploader";
import MapView from "./components/MapView"; 
import MapClusters from './components/MapClusters.jsx';

function App() {
  const { user, login, logout } = useAuth();
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch('http://localhost:3001/api/deliveries/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setDeliveries(data);
        console.log(data);
      } catch (err) {
        console.error("Failed to fetch deliveries:", err);
      }
    };

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
          <DeliveryUploader />

          <hr className="my-8" />
          <MapView deliveries={deliveries} /> 
          <MapClusters />
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