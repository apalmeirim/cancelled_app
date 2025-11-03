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
  isRemoving,
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
    <section className="space-y-6 text-center">
      <div className="space-y-3">
        <p className="text-xs tracking-[0.4em] text-gray-500">step 2</p>
        <h2 className="text-2xl font-semibold text-white">search for artists to remove</h2>
        <p className="text-sm text-gray-300">
          add the names of the artists you wish to remove. make sure the artist is spelled correctly.
        </p>
      </div>

      <Card padding="md" className="border-white/5 bg-black/60">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <label className="flex-1 space-y-2 text-center">
            <span className="text-xs tracking-[0.35em] text-gray-500">artist name</span>
            <input
              type="text"
              placeholder="ex: Taylor Swift"
              value={inputValue}
              onChange={event => setInputValue(event.target.value)}
              onKeyDown={handleKeyDown}
              className="h-12 w-full rounded-xl border border-white/15 bg-black/70 px-4 text-base text-gray-100 outline-none transition focus:border-white/70 focus:outline-none"
            />
          </label>
          <Button
            variant="secondary"
            size="md"
            className="md:w-auto"
            onClick={handleAdd}
            disabled={!inputValue.trim()}
          >
            add artist
          </Button>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex flex-col items-center gap-1 text-xs tracking-[0.35em] text-gray-500">
            <p>artists to remove</p>
            <span>{artists.length} added</span>
          </div>
          {artists.length ? (
            <div className="flex flex-wrap justify-center gap-2">
              {artists.map(artist => (
                <button
                  key={artist}
                  type="button"
                  onClick={() => onRemoveArtist(artist)}
                  className={cn(
                    "group inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-3 py-1.5 text-xs font-semibold tracking-[0.35em] text-white transition",
                    "hover:border-white/70 hover:bg-white/15"
                  )}
                >
                  {artist}
                  <span className="text-[0.65rem] font-bold text-white/60 group-hover:text-white">&times;</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-6 text-center text-sm text-gray-400">
              added artists will appear here. click a tag to remove it from the list.
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 text-xs tracking-[0.35em] text-gray-500">
          <p>
            {disabled
              ? "select playlists to enable the scan"
              : isScanning
              ? "scanning in progress..."
              : isRemoving
              ? "removing matched tracks..."
              : "you are ready to queue a cleanup scan"}
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={onSubmit}
            disabled={disabled || !artists.length || isScanning || isRemoving}
            className="px-6"
          >
            {isScanning ? "scanning..." : isRemoving ? "removing..." : "scan selected playlists"}
          </Button>
        </div>
        {scanError ? (
          <p className="mt-4 rounded-xl border border-white/30 bg-black/60 px-4 py-3 text-xs text-white/80">
            {scanError}
          </p>
        ) : null}
      </Card>
    </section>
  );
}
