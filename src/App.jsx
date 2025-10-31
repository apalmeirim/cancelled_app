import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const redirectParam = params.get("redirect");
    if (!redirectParam) return;

    const decoded = decodeURIComponent(redirectParam);
    const target = decoded.startsWith("/") ? decoded : `/${decoded}`;

    navigate(target, { replace: true });
  }, [location.search, navigate]);

  useEffect(() => {
    const savedToken = getStoredAccessToken();
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    if (!code) return;

    let cancelled = false;

    (async () => {
      const newToken = await handleRedirectCallback(code);
      if (cancelled) return;
      if (newToken) {
        setToken(newToken);
        navigate("/dashboard", { replace: true });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [location.search, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hasAuthCode = params.has("code");

    if (!token) {
      if (location.pathname === "/dashboard" && !hasAuthCode) {
        navigate("/login", { replace: true });
      }
      return;
    }

    if (location.pathname === "/login" || location.pathname === "/landingpage" || location.pathname === "/") {
      navigate("/dashboard", { replace: true });
    }
  }, [token, location.pathname, location.search, navigate]);

  const handleLogin = () => {
    redirectToSpotifyAuth();
  };

  const handleLogout = () => {
    logoutSpotify();
    setToken(null);
    navigate("/login", { replace: true });
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
