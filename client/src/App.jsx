import React from "react";
import { useAuth } from "./firebase/authContext";
import './App.css';

function App() {
  const { user, login, logout } = useAuth();

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      {user ? (
        <>
          <h2>Welcome, {user.displayName}</h2>
          <img
            src={user.photoURL}
            alt="avatar"
            width={100}
            style={{ borderRadius: "50%", margin: "1rem" }}
          />
          <br />
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <h1>StudyHub</h1>
          <button onClick={login}>Sign in with Google</button>
        </>
      )}
    </div>
  );
}

export default App;