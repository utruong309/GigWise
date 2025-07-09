import React from "react";
import { useAuth } from "./firebase/context.jsx";
import './App.css';
import DeliveryUploader from "./components/DeliveryUploader";

function App() {
  const { user, login, logout } = useAuth();

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