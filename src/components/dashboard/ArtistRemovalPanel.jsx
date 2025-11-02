import { useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import cn from "../../utils/cn";

export default function ArtistRemovalPanel({
  artists,
  onAddArtist,
  onRemoveArtist,
  onSubmit,
  disabled,
  isScanning,
  scanError,
}) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const value = inputValue.trim();
    if (!value) return;
    onAddArtist(value);
    setInputValue("");
  };

  const handleKeyDown = event => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAdd();
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-emerald-200/70">Step 2</p>
        <h2 className="text-2xl font-semibold text-emerald-100">Search for artists to remove</h2>
        <p className="text-sm text-slate-300/80">
          Add artist names you want to exclude. We&apos;ll cross-reference tracks inside your selected playlists.
        </p>
      </div>

      <Card padding="md" className="border-white/5 bg-slate-950/40">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <label className="flex-1 space-y-2">
            <span className="text-xs uppercase tracking-[0.35em] text-slate-400">Artist name</span>
            <input
              type="text"
              placeholder="Ex: Taylor Swift"
              value={inputValue}
              onChange={event => setInputValue(event.target.value)}
              onKeyDown={handleKeyDown}
              className="h-12 w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 text-base text-slate-100 outline-none transition focus:border-emerald-400/60 focus:outline-none"
            />
          </label>
          <Button
            variant="secondary"
            size="md"
            className="md:w-auto"
            onClick={handleAdd}
            disabled={!inputValue.trim()}
          >
            Add artist
          </Button>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Artists to remove</p>
            <span className="text-xs uppercase tracking-[0.35em] text-emerald-200/70">{artists.length} added</span>
          </div>
          {artists.length ? (
            <div className="flex flex-wrap gap-2">
              {artists.map(artist => (
                <button
                  key={artist}
                  type="button"
                  onClick={() => onRemoveArtist(artist)}
                  className={cn(
                    "group inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-100 transition",
                    "hover:border-red-400/50 hover:bg-red-500/15 hover:text-red-200"
                  )}
                >
                  {artist}
                  <span className="text-[0.65rem] font-bold group-hover:text-red-200">&times;</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-center text-sm text-slate-400/80">
              Added artists will appear here. Click a tag to remove it from the list.
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
            {disabled
              ? "Select playlists to enable the scan"
              : isScanning
              ? "Scanning in progress..."
              : "You are ready to queue a cleanup scan"}
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={onSubmit}
            disabled={disabled || !artists.length || isScanning}
            className="px-6"
          >
            {isScanning ? "Scanning..." : "Scan selected playlists"}
          </Button>
        </div>
        {scanError ? (
          <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-xs text-red-200">
            {scanError}
          </p>
        ) : null}
      </Card>
    </section>
  );
}
