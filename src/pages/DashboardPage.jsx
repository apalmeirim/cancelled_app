import { useEffect, useState } from "react";
import PlaylistGrid from "../components/dashboard/PlaylistGrid";
import ArtistRemovalPanel from "../components/dashboard/ArtistRemovalPanel";
import TutorialModal from "../components/dashboard/TutorialModal";
import ScanResults from "../components/dashboard/ScanResults";
import SpotifyConnectButton from "../components/common/SpotifyConnectButton";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const FALLBACK_COVER_GRADIENTS = [
  "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(0,0,0,0.85))",
  "linear-gradient(135deg, rgba(245,245,245,0.35), rgba(10,10,10,0.7))",
  "linear-gradient(135deg, rgba(220,220,220,0.3), rgba(15,15,15,0.85))",
  "linear-gradient(135deg, rgba(200,200,200,0.3), rgba(5,5,5,0.85))",
  "linear-gradient(135deg, rgba(240,240,240,0.25), rgba(0,0,0,0.75))",
  "linear-gradient(135deg, rgba(210,210,210,0.3), rgba(12,12,12,0.8))",
];

export default function DashboardPage({ token, onLogout, onLogin }) {
  const [playlists, setPlaylists] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [artists, setArtists] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [scanResults, setScanResults] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [removeError, setRemoveError] = useState(null);
  const [removeSummary, setRemoveSummary] = useState(null);
  const [isCreatingLikedSongsCopy, setIsCreatingLikedSongsCopy] = useState(false);
  const [likedSongsCopyFeedback, setLikedSongsCopyFeedback] = useState(null);

  useEffect(() => {
    if (!token) {
      setUserProfile(null);
      setProfileError(null);
      setIsProfileLoading(false);
      return;
    }

    let cancelled = false;
    setIsProfileLoading(true);
    setProfileError(null);

    const loadProfile = async () => {
      try {
        const response = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          throw new Error("Your Spotify session expired. Please reconnect.");
        }

        if (!response.ok) {
          throw new Error("We couldn't load your Spotify profile. Please try again.");
        }

        const data = await response.json();

        if (!data?.id) {
          throw new Error("We couldn't identify your Spotify account.");
        }

        if (!cancelled) {
          setUserProfile({
            id: data.id,
            displayName: data.display_name ?? data.id,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setProfileError(error.message || "Unexpected error loading your Spotify profile.");
          setUserProfile(null);
        }
      } finally {
        if (!cancelled) {
          setIsProfileLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!token) {
      setPlaylists([]);
      setSelectedIds([]);
      setFetchError(null);
      setIsLoading(false);
      setScanResults(null);
      setScanError(null);
      setIsScanning(false);
      setIsRemoving(false);
      setRemoveError(null);
      setRemoveSummary(null);
      setIsCreatingLikedSongsCopy(false);
      setLikedSongsCopyFeedback(null);
      return;
    }

    if (profileError) {
      setFetchError(profileError);
      setPlaylists([]);
      setSelectedIds([]);
      setIsLoading(false);
      return;
    }

    if (!userProfile?.id) {
      setIsLoading(isProfileLoading);
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

        const ownedPlaylists = rawPlaylists.filter(
          playlist => playlist.owner?.id === userProfile.id
        );

        const mapped = ownedPlaylists.map((playlist, index) => {
          return {
            id: playlist.id,
            name: playlist.name,
            tracks: playlist.tracks?.total ?? 0,
            image: playlist.images?.[0]?.url ?? null,
            coverGradient:
              playlist.images?.[0]?.url
                ? null
                : FALLBACK_COVER_GRADIENTS[
                    index % FALLBACK_COVER_GRADIENTS.length
                  ],
            uri: playlist.uri,
            externalUrl: playlist.external_urls?.spotify ?? null,
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
  }, [token, refreshIndex, userProfile?.id, profileError, isProfileLoading]);

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

  const handleSubmit = async () => {
    if (!token || !selectedIds.length || !artists.length || isScanning || isRemoving) return;

    const normalizedMap = new Map();
    artists.forEach(name => {
      const trimmed = name.trim();
      if (!trimmed) return;
      normalizedMap.set(trimmed.toLowerCase(), trimmed);
    });

    if (!normalizedMap.size) {
      setScanError("Add at least one artist to scan.");
      return;
    }

    const normalizedKeys = Array.from(normalizedMap.keys());
    const playlistsToScan = playlists.filter(playlist => selectedIds.includes(playlist.id));

    if (!playlistsToScan.length) {
      setScanError("Select at least one playlist to scan.");
      return;
    }

    setIsScanning(true);
    setScanError(null);
    setScanResults(null);
    setRemoveError(null);
    setRemoveSummary(null);

    try {
      const playlistResults = [];
      let totalMatches = 0;

      for (const playlist of playlistsToScan) {
        let nextUrl = `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?limit=100`;
        const matches = [];

        while (nextUrl) {
          const response = await fetch(nextUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 401) {
            throw new Error("Your Spotify session expired. Please reconnect.");
          }

          if (response.status === 429) {
            const retryAfter = response.headers.get("Retry-After");
            throw new Error(
              retryAfter
                ? `Spotify rate limited the request. Try again in ${retryAfter} seconds.`
                : "Spotify rate limited the request. Please try again shortly."
            );
          }

          if (!response.ok) {
            throw new Error("We couldn't finish scanning. Please try again.");
          }

          const data = await response.json();
          const items = data.items ?? [];

          items.forEach(item => {
            const track = item.track;
            if (!track) return;

            const trackArtistNames = (track.artists ?? [])
              .map(artist => artist?.name?.trim().toLowerCase())
              .filter(Boolean);

            if (!trackArtistNames.length) return;

            const matchedKeys = normalizedKeys.filter(key => trackArtistNames.includes(key));
            if (!matchedKeys.length) return;

            const matchedArtists = matchedKeys.map(key => normalizedMap.get(key));

            matches.push({
              id: track.id ?? track.uri ?? track.href ?? `${track.name}-${Math.random()}`,
              name: track.name ?? "Unknown track",
              artists: (track.artists ?? []).map(artist => artist?.name).filter(Boolean),
              matchedArtists,
              uri: track.uri ?? null,
              externalUrl: track.external_urls?.spotify ?? null,
              album: track.album?.name ?? "",
            });
          });

          nextUrl = data.next;
        }

        totalMatches += matches.length;
        playlistResults.push({
          id: playlist.id,
          name: playlist.name,
          matches,
          totalTracks: playlist.tracks,
          externalUrl: playlist.externalUrl,
        });
      }

      setScanResults({
        timestamp: Date.now(),
        artists: Array.from(normalizedMap.values()),
        totalPlaylistsScanned: playlistsToScan.length,
        totalMatches,
        playlists: playlistResults,
      });
    } catch (error) {
      setScanError(error.message || "Unexpected error while scanning playlists.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleRemoveMatches = async () => {
    if (!token || !scanResults || isRemoving) return;

    const playlistsWithMatches = (scanResults.playlists ?? []).filter(
      playlist => playlist?.id && Array.isArray(playlist.matches) && playlist.matches.length
    );

    if (!playlistsWithMatches.length) {
      setRemoveError("No matched tracks are available for removal.");
      return;
    }

    setIsRemoving(true);
    setRemoveError(null);
    setRemoveSummary(null);

    try {
      let removedTrackCount = 0;
      let affectedPlaylists = 0;

      const updatedById = new Map();

      for (const playlist of playlistsWithMatches) {
        const validMatches = playlist.matches.filter(match => match?.uri);
        const uniqueUris = Array.from(new Set(validMatches.map(match => match.uri)));

        if (!uniqueUris.length) {
          continue;
        }

        for (let i = 0; i < uniqueUris.length; i += 100) {
          const chunk = uniqueUris.slice(i, i + 100);
          const response = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tracks: chunk.map(uri => ({ uri })),
            }),
          });

          if (response.status === 401) {
            throw new Error("Your Spotify session expired. Please reconnect.");
          }

          if (response.status === 429) {
            const retryAfter = response.headers.get("Retry-After");
            throw new Error(
              retryAfter
                ? `Spotify rate limited the request. Try again in ${retryAfter} seconds.`
                : "Spotify rate limited the request. Please try again shortly."
            );
          }

          if (!response.ok) {
            throw new Error("We couldn't remove some tracks. Please try again.");
          }
        }

        removedTrackCount += playlist.matches.length;
        affectedPlaylists += 1;

        updatedById.set(playlist.id, {
          ...playlist,
          matches: [],
        });
      }

      if (updatedById.size) {
        const updatedPlaylists = (scanResults.playlists ?? []).map(playlist =>
          updatedById.get(playlist.id) ?? playlist
        );

        const remainingMatches = updatedPlaylists.reduce(
          (total, playlist) => total + playlist.matches.length,
          0
        );

        setScanResults({
          ...scanResults,
          playlists: updatedPlaylists,
          totalMatches: remainingMatches,
        });

        setRefreshIndex(index => index + 1);
      }

      if (removedTrackCount) {
        setRemoveSummary(
          `Removed ${removedTrackCount} track${removedTrackCount === 1 ? "" : "s"} across ${affectedPlaylists} playlist${affectedPlaylists === 1 ? "" : "s"}.`
        );
      } else {
        setRemoveSummary("No removable tracks were found in the scan results.");
      }
    } catch (error) {
      setRemoveError(error.message || "Unexpected error while removing tracks.");
    } finally {
      setIsRemoving(false);
    }
  };

  const handleCreateLikedSongsCopy = async () => {
    if (!token || !userProfile?.id || isCreatingLikedSongsCopy) return;

    setLikedSongsCopyFeedback(null);
    setIsCreatingLikedSongsCopy(true);

    try {
      const createResponse = await fetch(`https://api.spotify.com/v1/users/${userProfile.id}/playlists`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "ls copy",
          description: "Auto-generated copy of Liked Songs created by Cancelled.",
          public: false,
        }),
      });

      if (createResponse.status === 401) {
        throw new Error("Your Spotify session expired. Please reconnect.");
      }

      if (createResponse.status === 403) {
        throw new Error("Spotify denied playlist creation. Please check your account permissions.");
      }

      if (!createResponse.ok) {
        throw new Error("We couldn't create the playlist. Please try again.");
      }

      const playlistData = await createResponse.json();
      const playlistId = playlistData?.id;
      if (!playlistId) {
        throw new Error("Spotify did not return a playlist ID.");
      }

      let nextUrl = "https://api.spotify.com/v1/me/tracks?limit=50";
      const trackUris = [];

      while (nextUrl) {
        const likedResponse = await fetch(nextUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (likedResponse.status === 401) {
          throw new Error("Your Spotify session expired. Please reconnect.");
        }

        if (likedResponse.status === 429) {
          const retryAfter = likedResponse.headers.get("Retry-After");
          throw new Error(
            retryAfter
              ? `Spotify rate limited the request. Try again in ${retryAfter} seconds.`
              : "Spotify rate limited the request. Please try again shortly."
          );
        }

        if (!likedResponse.ok) {
          throw new Error("We couldn't fetch your liked songs. Please try again.");
        }

        const likedData = await likedResponse.json();
        const items = likedData.items ?? [];

        items.forEach(item => {
          const uri = item?.track?.uri;
          if (uri) {
            trackUris.push(uri);
          }
        });

        nextUrl = likedData.next;
      }

      for (let index = 0; index < trackUris.length; index += 100) {
        const chunk = trackUris.slice(index, index + 100);
        const addResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uris: chunk }),
        });

        if (addResponse.status === 401) {
          throw new Error("Your Spotify session expired. Please reconnect.");
        }

        if (addResponse.status === 429) {
          const retryAfter = addResponse.headers.get("Retry-After");
          throw new Error(
            retryAfter
              ? `Spotify rate limited the request. Try again in ${retryAfter} seconds.`
              : "Spotify rate limited the request. Please try again shortly."
          );
        }

        if (!addResponse.ok) {
          throw new Error("We couldn't add tracks to the new playlist. Please try again.");
        }
      }

      setLikedSongsCopyFeedback({
        type: "success",
        message: trackUris.length
          ? `Created "ls copy" with ${trackUris.length} track${trackUris.length === 1 ? "" : "s"}.`
          : 'Created "ls copy" but your Liked Songs list was empty.',
      });

      setRefreshIndex(index => index + 1);
    } catch (error) {
      setLikedSongsCopyFeedback({
        type: "error",
        message: error.message || "Unexpected error creating the Liked Songs copy.",
      });
    } finally {
      setIsCreatingLikedSongsCopy(false);
    }
  };

  const handleRefreshPlaylists = () => {
    if (!token) return;
    setRefreshIndex(index => index + 1);
  };

  const handleOpenPlaylist = playlist => {
    if (!playlist?.externalUrl) return;
    window.open(playlist.externalUrl, "_blank", "noopener,noreferrer");
  };

    if (!token) {
      return (
        <Card padding="lg" className="space-y-8 border-white/10 bg-black/70 text-center">
          <div className="space-y-4">
            <p className="text-xs tracking-[0.4em] text-gray-400">authentication required</p>
            <h1 className="text-3xl font-semibold text-white">connect Spotify to view your dashboard</h1>
          </div>
          <div className="flex flex-col items-center gap-4">
            <SpotifyConnectButton onClick={onLogin} label="connect with Spotify" />
            <p className="text-xs tracking-[0.35em] text-gray-500">
              go back to homepage to authorize Spotify.
            </p>
          </div>
        </Card>
      );
    }

  return (
    <div className="space-y-14 text-center">
      <header className="flex flex-col items-center gap-5">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">d@shboard</h2>
          <p className="mx-auto max-w-2xl text-sm text-gray-300">
            select playlist(s) and remove any artist(s).
            for "Liked Songs", view tutorial.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs tracking-[0.35em] text-gray-500">
          <Button variant="outline" size="sm" onClick={() => setModalOpen(true)}>
            tutorial for "Liked Songs"
          </Button>
        </div>
      </header>

      <PlaylistGrid
        playlists={playlists}
        selectedIds={selectedIds}
        onTogglePlaylist={handleTogglePlaylist}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
        isLoading={isLoading || isProfileLoading}
        isScanning={isScanning}
        isRemoving={isRemoving}
        error={fetchError || profileError}
        onRetry={handleRefreshPlaylists}
        onOpenPlaylist={handleOpenPlaylist}
      />

      <ArtistRemovalPanel
        artists={artists}
        onAddArtist={handleAddArtist}
        onRemoveArtist={handleRemoveArtist}
        onSubmit={handleSubmit}
        disabled={!selectedIds.length || isLoading || isProfileLoading}
        isScanning={isScanning}
        isRemoving={isRemoving}
        scanError={scanError}
      />

      <ScanResults
        results={scanResults}
        isScanning={isScanning}
        onRemoveMatches={handleRemoveMatches}
        isRemoving={isRemoving}
        removeError={removeError}
        removeSummary={removeSummary}
      />

      <TutorialModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreateCopy={handleCreateLikedSongsCopy}
        isCreatingCopy={isCreatingLikedSongsCopy}
        creationStatus={likedSongsCopyFeedback}
      />

      <div className="flex justify-center">
        <Button variant="ghost" size="sm" onClick={onLogout}>
          log out
        </Button>
      </div>
    </div>
  );
}
