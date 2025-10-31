import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  redirectToSpotifyAuth,
  handleRedirectCallback,
  getStoredAccessToken,
  logoutSpotify,
} from "./utils/spotifyAuth";
import AppLayout from "./components/Layout/AppLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      const newToken = await handleRedirectCallback();
      if (newToken) {
        setToken(newToken);
        return;
      }

      const savedToken = getStoredAccessToken();
      if (savedToken) {
        setToken(savedToken);
      }
    }

    checkAuth();
  }, []);

  const handleLogin = () => {
    redirectToSpotifyAuth();
  };

  const handleLogout = () => {
    logoutSpotify();
    setToken(null);
  };

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/landingpage" replace />} />
        <Route path="/landingpage" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            token ? <Navigate to="/dashboard" replace /> : <LoginPage token={token} onLogin={handleLogin} />
          }
        />
        <Route
          path="/dashboard"
          element={<DashboardPage token={token} onLogout={handleLogout} onLogin={handleLogin} />}
        />
        <Route path="*" element={<Navigate to="/landingpage" replace />} />
      </Route>
    </Routes>
  );
}