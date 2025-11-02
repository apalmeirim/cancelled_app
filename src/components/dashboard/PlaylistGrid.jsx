import Button from "../ui/Button";
import Card from "../ui/Card";
import PlaylistCard from "./PlaylistCard";

export default function PlaylistGrid({
  playlists,
  selectedIds,
  onTogglePlaylist,
  onSelectAll,
  onClearSelection,
  isLoading,
  isScanning,
  isRemoving,
  error,
  onRetry,
  onOpenPlaylist,
}) {
  const selectedCount = selectedIds.length;
  const totalPlaylists = playlists.length;
  const hasPlaylists = totalPlaylists > 0;
  const isBusy = isLoading || isScanning || isRemoving;
  const canSelectAll = hasPlaylists && selectedCount !== totalPlaylists && !isBusy && !error;
  const canClear = !!selectedCount && !isBusy;
  const handleRetry = onRetry ?? (() => {});
  const handleOpen = onOpenPlaylist ?? (() => {});

  return (
    <section className="space-y-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Step 1</p>
          <h2 className="text-2xl font-semibold text-white">Choose playlists to clean</h2>
          <p className="text-sm text-gray-300">
            Select one or multiple playlists. You can highlight all of them or reset with a single click.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="ghost" size="sm" onClick={onClearSelection} disabled={!canClear}>
            Clear
          </Button>
          <Button variant="outline" size="sm" onClick={onSelectAll} disabled={!canSelectAll}>
            Select all
          </Button>
        </div>
      </div>

      <Card padding="md" className="border-white/5 bg-black/60">
        <div className="mb-6 flex flex-col items-center gap-2 text-sm text-gray-300">
          <span>
            {selectedCount ? `${selectedCount} playlist${selectedCount > 1 ? "s" : ""} selected` : "No playlist selected yet"}
          </span>
          <span className="text-xs uppercase tracking-[0.35em] text-gray-500">Total {totalPlaylists}</span>
        </div>
        {isLoading ? (
          <div className="flex min-h-[160px] items-center justify-center text-sm text-gray-300">
            Loading your playlists...
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-4 py-10 text-center text-sm text-gray-300">
            <p>{error}</p>
            <Button variant="outline" size="sm" onClick={handleRetry}>
              Try again
            </Button>
          </div>
        ) : hasPlaylists ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {playlists.map(playlist => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                selected={selectedIds.includes(playlist.id)}
                onToggle={onTogglePlaylist}
                onOpen={handleOpen}
                isBusy={isBusy}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[160px] items-center justify-center text-sm text-gray-300">
            No playlists found for this account.
          </div>
        )}
      </Card>
    </section>
  );
}
