import Card from "../ui/Card";
import Button from "../ui/Button";
import cn from "../../utils/cn";

export default function PlaylistCard({ playlist, selected, onToggle, onOpen, isBusy }) {
  const gradient =
    playlist.coverGradient ??
    "linear-gradient(135deg, rgba(255,255,255,0.4), rgba(0,0,0,0.7))";

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
      ? "tracks n/a"
      : `${playlist.tracks} track${playlist.tracks === 1 ? "" : "s"}`;

  return (
    <Card
      padding="none"
      className={cn(
        "group relative h-40 overflow-hidden transition duration-200",
        selected ? "border-white/80 shadow-[0_16px_36px_rgba(255,255,255,0.2)]" : "hover:border-white/40",
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
      <div className="absolute inset-0 bg-black/50 mix-blend-multiply" aria-hidden="true" />
      <div
        className={cn(
          "absolute inset-0 flex items-end border-2 border-transparent text-white transition",
          selected ? "border-white/70" : ""
        )}
      >
        <div className="w-full px-4 py-2 text-xs tracking-[0.3em] text-white/90 drop-shadow">
          {trackCountLabel}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 px-6 text-center opacity-0 transition duration-200 group-hover:opacity-100">
        <div className="pointer-events-auto space-y-3">
          <h3 className="text-lg font-semibold leading-tight text-white">{playlist.name}</h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant={selected ? "secondary" : "primary"}
              size="sm"
              onClick={handleSelect}
              disabled={isBusy}
            >
              {selected ? "selected" : "select"}
            </Button>
            {playlist.externalUrl ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpen}
                disabled={isBusy}
              >
                open in Spotify
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}
