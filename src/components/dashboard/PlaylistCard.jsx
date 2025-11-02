import { Fragment } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import cn from "../../utils/cn";

export default function PlaylistCard({ playlist, selected, onToggle }) {
  const infoRows = [
    {
      label: "Tracks",
      value: playlist.tracks ?? "N/A",
    },
    {
      label: "Visibility",
      value:
        playlist.isPublic === undefined || playlist.isPublic === null
          ? "N/A"
          : playlist.isPublic
          ? "Public"
          : "Private",
    },
    {
      label: "Collaborative",
      value: playlist.collaborative ? "Yes" : "No",
    },
  ];

  const coverGradient =
    playlist.coverGradient ??
    "linear-gradient(135deg, rgba(16,205,230,0.55), rgba(129,140,248,0.45))";

  return (
    <Card
      className={cn(
        "flex h-full flex-col gap-4 transition duration-200",
        selected ? "border-emerald-400/60 bg-slate-900/70" : "hover:border-emerald-400/40"
      )}
      padding="md"
    >
      <div className="relative min-h-[160px] overflow-hidden rounded-2xl text-white">
        {playlist.image ? (
          <img
            src={playlist.image}
            alt={playlist.name}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: coverGradient }} aria-hidden="true" />
        )}
        <div className="absolute inset-0 bg-slate-900/50" aria-hidden="true" />
        <div className="absolute inset-0 bg-white/15 mix-blend-overlay" aria-hidden="true" />
        <div className="relative z-10 space-y-2 p-6">
          <p className="text-xs uppercase tracking-[0.45em] text-white/70">Playlist</p>
          <h3 className="text-xl font-semibold leading-tight text-white">{playlist.name}</h3>
          {playlist.owner ? (
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">
              {playlist.owner}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 text-sm text-slate-200/80">
        <div className="space-y-3">
          {playlist.description ? <p className="text-slate-300/80">{playlist.description}</p> : null}
          <div className="grid grid-cols-2 gap-y-2 text-xs uppercase tracking-[0.25em] text-slate-400">
            {infoRows.map(row => (
              <Fragment key={row.label}>
                <span>{row.label}</span>
                <span className="text-right text-slate-200/80">{row.value}</span>
              </Fragment>
            ))}
          </div>
          {playlist.tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {playlist.tags.map(tag => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.35em] text-slate-200/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <Button
          variant={selected ? "secondary" : "outline"}
          size="md"
          onClick={() => onToggle(playlist.id)}
        >
          {selected ? "Selected" : "Select playlist"}
        </Button>
      </div>
    </Card>
  );
}
