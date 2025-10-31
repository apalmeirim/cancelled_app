import { useMemo, useState } from "react";
import PlaylistGrid from "../components/dashboard/PlaylistGrid";
import ArtistRemovalPanel from "../components/dashboard/ArtistRemovalPanel";
import TutorialModal from "../components/dashboard/TutorialModal";
import SpotifyConnectButton from "../components/common/SpotifyConnectButton";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const MOCK_PLAYLISTS = [
  {
    id: "focus-flow",
    name: "Focus Flow",
    description: "Ambient electronica for deep work sprints.",
    tracks: 86,
    duration: "6 hr 12 min",
    updated: "2 days ago",
    tags: ["Lo-fi", "Instrumental"],
    coverGradient: "linear-gradient(135deg, rgba(16,205,230,0.55), rgba(129,140,248,0.45))",
  },
  {
    id: "cardio-pop",
    name: "Cardio Pop",
    description: "High-energy hits that keep your pace up.",
    tracks: 54,
    duration: "3 hr 4 min",
    updated: "5 days ago",
    tags: ["Workout", "Pop"],
    coverGradient: "linear-gradient(135deg, rgba(236,72,153,0.55), rgba(34,211,238,0.45))",
  },
  {
    id: "after-dark",
    name: "After Dark Sessions",
    description: "Smooth alt-R&B for late nights and soft lighting.",
    tracks: 73,
    duration: "4 hr 45 min",
    updated: "1 week ago",
    tags: ["R&B", "Night"],
    coverGradient: "linear-gradient(135deg, rgba(79,70,229,0.5), rgba(236,72,153,0.4))",
  },
  {
    id: "roadtrip",
    name: "Pacific Coast Roadtrip",
    description: "Sing-alongs, indie staples, and sunny classics.",
    tracks: 108,
    duration: "7 hr 20 min",
    updated: "3 days ago",
    tags: ["Indie", "Classic"],
    coverGradient: "linear-gradient(135deg, rgba(45,212,191,0.55), rgba(250,204,21,0.4))",
  },
  {
    id: "discover",
    name: "Discover Dispatch",
    description: "Weekly finds from Release Radar and friends.",
    tracks: 35,
    duration: "2 hr 18 min",
    updated: "Today",
    tags: ["Discovery"],
    coverGradient: "linear-gradient(135deg, rgba(129,140,248,0.5), rgba(253,186,116,0.35))",
  },
  {
    id: "coffeehouse",
    name: "Sunday Coffeehouse",
    description: "Acoustic warmth for slow mornings.",
    tracks: 42,
    duration: "2 hr 55 min",
    updated: "4 days ago",
    tags: ["Acoustic", "Morning"],
    coverGradient: "linear-gradient(135deg, rgba(74,222,128,0.5), rgba(14,165,233,0.35))",
  },
];

export default function DashboardPage({ token, onLogout, onLogin }) {
  const playlists = useMemo(() => MOCK_PLAYLISTS, []);
  const [selectedIds, setSelectedIds] = useState([]);
  const [artists, setArtists] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const handleTogglePlaylist = id => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]));
  };

  const handleSelectAll = () => {
    setSelectedIds(playlists.map(playlist => playlist.id));
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleAddArtist = name => {
    setArtists(prev => (prev.includes(name) ? prev : [...prev, name]));
  };

  const handleRemoveArtist = name => {
    setArtists(prev => prev.filter(artist => artist !== name));
  };

  const handleSubmit = () => {
    // Placeholder for upcoming integration with Spotify APIs
    console.table({ selectedPlaylists: selectedIds, artists });
  };

  if (!token) {
    return (
      <Card padding="lg" className="space-y-8 border-white/10 bg-slate-950/55 text-center">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-200/70">Authentication required</p>
          <h1 className="text-3xl font-semibold text-emerald-100">Connect Spotify to view your dashboard</h1>
          <p className="text-sm text-slate-300/80">
            Once you approve access, we will pull in every playlist linked to your account so you can start removing
            artists instantly.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <SpotifyConnectButton onClick={onLogin} label="Connect with Spotify" />
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400/70">
            Need an invite? Request it at cancelled.fm
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-14">
      <header className="flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-200/70">Dashboard</p>
          <h1 className="text-3xl font-semibold text-emerald-100">Curate faster with artist-based removals</h1>
          <p className="max-w-2xl text-sm text-slate-300/80">
            Select playlists, queue artists, and approve results in batches. We will show you every track match before
            syncing back to Spotify.
          </p>
        </div>
        <div className="flex flex-col items-end gap-3 text-xs uppercase tracking-[0.35em] text-slate-400">
          <Button variant="ghost" size="sm" onClick={onLogout}>
            Log out
          </Button>
          <Button variant="outline" size="sm" onClick={() => setModalOpen(true)}>
            Liked songs tutorial
          </Button>
        </div>
      </header>

      <PlaylistGrid
        playlists={playlists}
        selectedIds={selectedIds}
        onTogglePlaylist={handleTogglePlaylist}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
      />

      <ArtistRemovalPanel
        artists={artists}
        onAddArtist={handleAddArtist}
        onRemoveArtist={handleRemoveArtist}
        onSubmit={handleSubmit}
        disabled={!selectedIds.length}
      />

      <Card padding="lg" className="border-white/10 bg-slate-950/45">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-200/70">Sync summary</p>
            <h2 className="text-xl font-semibold text-emerald-100">What happens next?</h2>
            <p className="text-sm text-slate-300/80">
              Cancelled runs safely on top of Spotify API endpoints. Once integrations are live, we will display a full
              report of every track slated for removal, complete with undo history.
            </p>
          </div>
          <ul className="space-y-3 text-sm text-slate-200/80">
            <li>- Nothing is deleted until you explicitly approve the sync.</li>
            <li>- We keep an audit log of every track for recovery.</li>
            <li>- Collaboration support is on the roadmap for shared playlists.</li>
          </ul>
        </div>
      </Card>

      <TutorialModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}