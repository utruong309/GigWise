import React, { useState, useEffect } from "react";
import { useAuth } from "./firebase/context.jsx";
import DeliveryUploader from "./components/DeliveryUploader";
import MapView from "./components/MapView"; 
import './App.css';

function App() {
  const { user, login, logout } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [view, setView] = useState('map'); 

  useEffect(() => {
    const fetchDeliveries = async () => {
      if (!user) return;
      const token = await user.getIdToken();

      const res = await fetch('http://localhost:3001/api/deliveries/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setDeliveries(data);
      } else {
        console.error('Failed to fetch deliveries');
      }
    };

    fetchDeliveries();
  }, [user]);

  return (
    <div className="text-center p-8 font-sans">
      {user ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Welcome, {user.displayName}</h2>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>

          <div className="my-6">
            <button
              onClick={() => setView('form')}
              className={`mx-2 px-4 py-2 rounded ${view === 'form' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Delivery Form
            </button>
            <button
              onClick={() => setView('map')}
              className={`mx-2 px-4 py-2 rounded ${view === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              View Map
            </button>
          </div>

          {view === 'form' ? (
            <DeliveryUploader />
          ) : (
            <MapView deliveries={deliveries} />
          )}
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