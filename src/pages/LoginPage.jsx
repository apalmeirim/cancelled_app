import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SpotifyConnectButton from "../components/common/SpotifyConnectButton";
import Card from "../components/ui/Card";

export default function LoginPage({ token, onLogin }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  return (
    <Card padding="lg" className="flex flex-col items-center gap-6 border-white/12 bg-black/70 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">login to continue</h1>
        <p className="text-sm text-gray-300">
          authorise Spotify to continue to dashboard.
        </p>
      </div>
      <SpotifyConnectButton onClick={onLogin} />
    </Card>
  );
}
