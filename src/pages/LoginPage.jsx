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
    <Card padding="lg" className="flex flex-col items-center gap-6 border-white/12 bg-slate-950/65 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-emerald-100">Log in to continue</h1>
        <p className="text-sm text-slate-300/80">
          Authorise Spotify to continue to dashboard.
        </p>
      </div>
      <SpotifyConnectButton onClick={onLogin} />
      <div className="w-full rounded-lg border border-dashed border-white/10 bg-slate-900/40 px-4 py-3 text-left text-xs font-mono text-slate-300/80">
        <p className="uppercase tracking-[0.35em] text-slate-400">Debug</p>
        <p>Token present: {token ? "yes" : "no"}</p>
      </div>
    </Card>
  );
}
