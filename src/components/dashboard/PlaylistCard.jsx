import Card from "../ui/Card";
import Button from "../ui/Button";
import cn from "../../utils/cn";

export default function PlaylistCard({ playlist, selected, onToggle, onOpen, isBusy }) {
  const gradient =
    playlist.coverGradient ??
    "linear-gradient(135deg, rgba(16,205,230,0.55), rgba(129,140,248,0.45))";

  const handleSelect = event => {
    event.stopPropagation();
    if (isBusy) return;
    onToggle(playlist.id);
  };

  const handleOpen = event => {
    event.stopPropagation();
    if (isBusy) return;
    if (onOpen) {
      onOpen(playlist);
      return;
    }
    if (playlist.externalUrl) {
      window.open(playlist.externalUrl, "_blank", "noopener,noreferrer");
    }
  };

  const trackCountLabel =
    playlist.tracks === undefined || playlist.tracks === null
      ? "Tracks N/A"
      : `${playlist.tracks} track${playlist.tracks === 1 ? "" : "s"}`;

  return (
    <Card
      padding="none"
      className={cn(
        "group relative h-40 overflow-hidden transition duration-200",
        selected ? "border-emerald-400/70 shadow-[0_16px_40px_rgba(16,185,129,0.35)]" : "hover:border-emerald-400/50",
        isBusy ? "opacity-70" : ""
      )}
    >
      {playlist.image ? (
        <img
          src={playlist.image}
          alt={playlist.name}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0" style={{ background: gradient }} aria-hidden="true" />
      )}
      <div className="absolute inset-0 bg-slate-900/50 mix-blend-multiply" aria-hidden="true" />
      <div
        className={cn(
          "absolute inset-0 flex items-end border-2 border-transparent text-white transition",
          selected ? "border-emerald-300/60" : ""
        )}
      >
        <div className="w-full bg-slate-950/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/80">
          {trackCountLabel}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-950/80 px-6 text-center opacity-0 transition duration-200 group-hover:opacity-100">
        <div className="pointer-events-auto space-y-3">
          <h3 className="text-lg font-semibold leading-tight text-emerald-100">{playlist.name}</h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant={selected ? "secondary" : "primary"}
              size="sm"
              onClick={handleSelect}
              disabled={isBusy}
            >
              {selected ? "Selected" : "Select"}
            </Button>
            {playlist.externalUrl ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpen}
                disabled={isBusy}
              >
                Open in Spotify
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}
