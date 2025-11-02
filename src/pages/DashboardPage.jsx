import { useEffect, useState } from "react";
import PlaylistGrid from "../components/dashboard/PlaylistGrid";
import ArtistRemovalPanel from "../components/dashboard/ArtistRemovalPanel";
import TutorialModal from "../components/dashboard/TutorialModal";
import SpotifyConnectButton from "../components/common/SpotifyConnectButton";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const FALLBACK_COVER_GRADIENTS = [
  "linear-gradient(135deg, rgba(16,205,230,0.55), rgba(129,140,248,0.45))",
  "linear-gradient(135deg, rgba(236,72,153,0.55), rgba(34,211,238,0.45))",
  "linear-gradient(135deg, rgba(79,70,229,0.5), rgba(236,72,153,0.4))",
  "linear-gradient(135deg, rgba(45,212,191,0.55), rgba(250,204,21,0.4))",
  "linear-gradient(135deg, rgba(129,140,248,0.5), rgba(253,186,116,0.35))",
  "linear-gradient(135deg, rgba(74,222,128,0.5), rgba(14,165,233,0.35))",
];

export default function DashboardPage({ token, onLogout, onLogin }) {
  const [playlists, setPlaylists] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [artists, setArtists] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    if (!token) {
      setPlaylists([]);
      setSelectedIds([]);
      setFetchError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const loadPlaylists = async () => {
      setIsLoading(true);
      setFetchError(null);

      try {
        let nextUrl = "https://api.spotify.com/v1/me/playlists?limit=50";
        const rawPlaylists = [];

        while (nextUrl) {
          const response = await fetch(nextUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 401) {
            throw new Error("Your Spotify session expired. Please reconnect.");
          }

          if (!response.ok) {
            throw new Error("We couldn't load your playlists. Please try again.");
          }

          const data = await response.json();
          rawPlaylists.push(...(data.items ?? []));
          nextUrl = data.next;
        }

        const mapped = rawPlaylists.map((playlist, index) => {
          const owner =
            playlist.owner?.display_name ??
            playlist.owner?.id ??
            "Unknown creator";
          const description = playlist.description
            ? playlist.description.replace(/<[^>]*>/g, "").trim()
            : "";

          return {
            id: playlist.id,
            name: playlist.name,
            description: description || `Created by ${owner}`,
            tracks: playlist.tracks?.total ?? 0,
            owner,
            isPublic: playlist.public,
            collaborative: playlist.collaborative,
            image: playlist.images?.[0]?.url ?? null,
            coverGradient:
              playlist.images?.[0]?.url
                ? null
                : FALLBACK_COVER_GRADIENTS[
                    index % FALLBACK_COVER_GRADIENTS.length
                  ],
            tags: playlist.collaborative ? ["Collaborative"] : [],
            uri: playlist.uri,
          };
        });

        if (!cancelled) {
          setPlaylists(mapped);
          setSelectedIds(prev =>
            prev.filter(id => mapped.some(playlist => playlist.id === id))
          );
        }
      } catch (error) {
        if (!cancelled) {
          setFetchError(error.message || "Unexpected error loading playlists.");
          setPlaylists([]);
          setSelectedIds([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadPlaylists();

    return () => {
      cancelled = true;
    };
  }, [token, refreshIndex]);

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

  const handleRefreshPlaylists = () => {
    if (!token) return;
    setRefreshIndex(index => index + 1);
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
          <h1 className="text-3xl font-semibold text-emerald-100">d@shboard</h1>
          <p className="max-w-2xl text-sm text-slate-300/80">
            select playlist(s) and remove any artist(s).
            for "Liked Songs", view tutorial.
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
        isLoading={isLoading}
        error={fetchError}
        onRetry={handleRefreshPlaylists}
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
