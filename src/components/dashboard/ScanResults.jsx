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
    <Card padding="lg" className="border-white/10 bg-slate-950/45 space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-emerald-200/70">Scan summary</p>
        <h2 className="text-xl font-semibold text-emerald-100">Review matched tracks</h2>
        <p className="text-sm text-slate-300/80">
          {isScanning
            ? "We're scanning your playlists. This can take a moment for large collections."
            : results
            ? totalMatches
              ? `Found ${totalMatches} track${totalMatches === 1 ? "" : "s"} across ${scannedCount} playlist${scannedCount === 1 ? "" : "s"}.`
              : `No matches found across ${scannedCount} playlist${scannedCount === 1 ? "" : "s"}.`
            : "Kick off a scan to see which tracks will be removed."}
        </p>
      </header>

      {canRemove ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-200/80">
          <span>
            {totalMatches} track{totalMatches === 1 ? "" : "s"} ready for removal across {playlistsWithMatches.length} playlist{playlistsWithMatches.length === 1 ? "" : "s"}.
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={onRemoveMatches}
            disabled={isScanning || isRemoving}
          >
            {isRemoving ? "Removing..." : "Remove matched tracks"}
          </Button>
        </div>
      ) : null}

      {removeError ? (
        <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-xs text-red-200">
          {removeError}
        </p>
      ) : null}

      {removeSummary ? (
        <p className="rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-100">
          {removeSummary}
        </p>
      ) : null}

      {isScanning && !results ? (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-white/10 px-6 py-12 text-sm text-slate-300/80">
          Scanning in progress...
        </div>
      ) : playlistsWithMatches.length ? (
        <div className="space-y-6">
          {playlistsWithMatches.map(playlist => {
            const visibleMatches = playlist.matches.slice(0, MAX_TRACKS_DISPLAY);
            const hiddenCount = playlist.matches.length - visibleMatches.length;

            return (
              <div
                key={playlist.id}
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm text-slate-200/85"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.35em] text-emerald-200/70">Playlist</p>
                    <h3 className="text-lg font-semibold text-emerald-100">{playlist.name}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-300/80">
                    <span>{playlist.matches.length} match{playlist.matches.length === 1 ? "" : "es"}</span>
                    <span>
                      {playlist.totalTracks === undefined || playlist.totalTracks === null
                        ? "Total N/A"
                        : `${playlist.totalTracks} total`}
                    </span>
                    {playlist.externalUrl ? (
                      <Button as="a" href={playlist.externalUrl} target="_blank" rel="noreferrer" variant="outline" size="sm">
                        Open playlist
                      </Button>
                    ) : null}
                  </div>
                </div>

                <ul className="mt-4 space-y-3">
                  {visibleMatches.map(match => (
                    <li
                      key={match.id ?? `${playlist.id}-${match.name}`}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-emerald-100">{match.name}</p>
                        <p className="truncate text-xs uppercase tracking-[0.3em] text-slate-400">
                          {match.artists.join(", ")}
                        </p>
                        <p className="truncate text-xs text-slate-400/80">
                          Matched artist{match.matchedArtists.length === 1 ? "" : "s"}:{" "}
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
                          View track
                        </Button>
                      ) : null}
                    </li>
                  ))}
                </ul>
                {hiddenCount > 0 ? (
                  <p className="mt-3 rounded-xl border border-dashed border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300/80">
                    +{hiddenCount} more match{hiddenCount === 1 ? "" : "es"} not shown. Narrow your artist list or open the playlist to review everything.
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : results ? (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-white/10 px-6 py-12 text-sm text-slate-300/80">
          No tracks matched the artists you provided. Try broadening the artist list or scanning additional playlists.
        </div>
      ) : null}
    </Card>
  );
}
