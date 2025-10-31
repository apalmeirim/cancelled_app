import Button from "../ui/Button";
import Card from "../ui/Card";
import PlaylistCard from "./PlaylistCard";

export default function PlaylistGrid({
  playlists,
  selectedIds,
  onTogglePlaylist,
  onSelectAll,
  onClearSelection,
}) {
  const selectedCount = selectedIds.length;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-200/70">Step 1</p>
          <h2 className="text-2xl font-semibold text-emerald-100">Choose playlists to clean</h2>
          <p className="text-sm text-slate-300/80">
            Select one or multiple playlists. You can highlight all of them or reset with a single click.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onClearSelection} disabled={!selectedCount}>
            Clear
          </Button>
          <Button variant="outline" size="sm" onClick={onSelectAll} disabled={selectedCount === playlists.length}>
            Select all
          </Button>
        </div>
      </div>

      <Card padding="md" className="border-white/5 bg-slate-950/40">
        <div className="mb-4 flex items-center justify-between text-sm text-slate-300/80">
          <span>
            {selectedCount ? `${selectedCount} playlist${selectedCount > 1 ? "s" : ""} selected` : "No playlist selected yet"}
          </span>
          <span className="text-xs uppercase tracking-[0.35em] text-emerald-200/70">Total {playlists.length}</span>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {playlists.map(playlist => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              selected={selectedIds.includes(playlist.id)}
              onToggle={onTogglePlaylist}
            />
          ))}
        </div>
      </Card>
    </section>
  );
}
