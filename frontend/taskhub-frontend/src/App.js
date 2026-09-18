import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/dashboardPage";
import InfoPersonali from "./pages/infopersonali";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));


  const handleLogin = (newToken, newUserId) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userId", newUserId);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken(null);
  };

  return (
    <Router>
      <Routes>

        {/*Homepage*/}
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/dashboard" />
            ) : (
              <HomePage onLoginSuccess={handleLogin} />
            )
          }
        />

        {/*DashboardPage*/}
        <Route
          path="/dashboard"
          element={
            token ? (
              <DashboardPage token={token} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/*Infopersonali*/}
        <Route
          path="/account"
          element={
            token ? (
              <InfoPersonali token={token} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
