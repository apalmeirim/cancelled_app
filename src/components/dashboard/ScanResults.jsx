import Card from "../ui/Card";
import Button from "../ui/Button";

const MAX_TRACKS_DISPLAY = 25;

export default function ScanResults({
  results,
  isScanning,
  onRemoveMatches,
  isRemoving,
  removeError,
  removeSummary,
}) {
  if (!results && !isScanning) {
    return null;
  }

  const playlistsWithMatches = results?.playlists?.filter(playlist => playlist.matches.length) ?? [];
  const totalMatches = results?.totalMatches ?? 0;
  const scannedCount = results?.totalPlaylistsScanned ?? 0;
  const canRemove = !!onRemoveMatches && playlistsWithMatches.length > 0;

  return (
    <Card padding="lg" className="border-white/10 bg-black/60 space-y-6 text-center">
      <header className="space-y-2">
        <p className="text-xs tracking-[0.35em] text-gray-500">scan summary</p>
        <h2 className="text-xl font-semibold text-white">review matched tracks</h2>
        <p className="text-sm text-gray-300">
          {isScanning
            ? "we're scanning your playlists. this can take a moment for large collections."
            : results
            ? totalMatches
              ? `found ${totalMatches} track${totalMatches === 1 ? "" : "s"} across ${scannedCount} playlist${scannedCount === 1 ? "" : "s"}.`
              : `no matches found across ${scannedCount} playlist${scannedCount === 1 ? "" : "s"}.`
            : "kick off a scan to see which tracks will be removed."}
        </p>
      </header>

      {canRemove ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-sm text-gray-200">
          <span>
            {totalMatches} track{totalMatches === 1 ? "" : "s"} ready for removal across {playlistsWithMatches.length} playlist{playlistsWithMatches.length === 1 ? "" : "s"}.
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={onRemoveMatches}
            disabled={isScanning || isRemoving}
          >
            {isRemoving ? "removing..." : "remove matched tracks"}
          </Button>
        </div>
      ) : null}

      {removeError ? (
        <p className="rounded-xl border border-white/20 bg-black/60 px-4 py-3 text-xs text-red-200">
          {removeError}
        </p>
      ) : null}

      {removeSummary ? (
        <p className="rounded-xl border border-white/30 bg-white/5 px-4 py-3 text-xs text-gray-200">
          {removeSummary}
        </p>
      ) : null}

      {isScanning && !results ? (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-white/10 px-6 py-12 text-sm text-gray-300">
          scanning in progress...
        </div>
      ) : playlistsWithMatches.length ? (
        <div className="space-y-6 text-center md:text-left">
          {playlistsWithMatches.map(playlist => {
            const visibleMatches = playlist.matches.slice(0, MAX_TRACKS_DISPLAY);
            const hiddenCount = playlist.matches.length - visibleMatches.length;

            return (
              <div
                key={playlist.id}
                className="rounded-2xl border border-white/10 bg-black/70 p-5 text-sm text-gray-200"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 text-center md:text-left">
                  <div className="space-y-1 w-full md:w-auto">
                    <p className="text-xs tracking-[0.35em] text-gray-500">playlist</p>
                    <h3 className="text-lg font-semibold text-white">{playlist.name}</h3>
                  </div>
                  <div className="flex w-full flex-wrap items-center justify-center gap-3 text-xs tracking-[0.3em] text-gray-400 md:w-auto md:justify-end">
                    <span>{playlist.matches.length} match{playlist.matches.length === 1 ? "" : "es"}</span>
                    <span>
                      {playlist.totalTracks === undefined || playlist.totalTracks === null
                        ? "total N/A"
                        : `${playlist.totalTracks} total`}
                    </span>
                    {playlist.externalUrl ? (
                      <Button as="a" href={playlist.externalUrl} target="_blank" rel="noreferrer" variant="outline" size="sm">
                        open playlist
                      </Button>
                    ) : null}
                  </div>
                </div>

                <ul className="mt-4 space-y-3">
                  {visibleMatches.map(match => (
                    <li
                      key={match.id ?? `${playlist.id}-${match.name}`}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-center md:text-left"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">{match.name}</p>
                        <p className="truncate text-xs tracking-[0.3em] text-gray-400">
                          {match.artists.join(", ")}
                        </p>
                        <p className="truncate text-xs text-gray-400/80">
                          matched artist{match.matchedArtists.length === 1 ? "" : "s"}:{" "}
                          {match.matchedArtists.join(", ")}
                        </p>
                      </div>
                      {match.externalUrl ? (
                        <Button
                          as="a"
                          href={match.externalUrl}
                          target="_blank"
                          rel="noreferrer"
                          variant="ghost"
                          size="sm"
                        >
                          view track
                        </Button>
                      ) : null}
                    </li>
                  ))}
                </ul>
                {hiddenCount > 0 ? (
                  <p className="mt-3 rounded-xl border border-dashed border-white/10 bg-white/5 px-4 py-2 text-xs text-gray-300 text-center">
                    +{hiddenCount} more match{hiddenCount === 1 ? "" : "es"} not shown. narrow your artist list or open the playlist to review everything.
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : results ? (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-white/10 px-6 py-12 text-sm text-gray-300">
          no tracks matched the artists you provided. try broadening the artist list or scanning additional playlists.
        </div>
      ) : null}
    </Card>
  );
}
