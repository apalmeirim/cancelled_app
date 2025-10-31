import Card from "../ui/Card";
import Button from "../ui/Button";
import cn from "../../utils/cn";

export default function PlaylistCard({ playlist, selected, onToggle }) {
  return (
    <Card
      className={cn(
        "flex h-full flex-col gap-4 transition duration-200",
        selected ? "border-emerald-400/60 bg-slate-900/70" : "hover:border-emerald-400/40"
      )}
      padding="md"
    >
      <div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400/45 via-emerald-500/30 to-teal-400/40 p-6 text-slate-950"
        style={
          playlist.coverGradient
            ? { background: playlist.coverGradient }
            : undefined
        }
      >
        <div className="absolute inset-0 bg-white/15 mix-blend-overlay" aria-hidden="true" />
        <div className="relative z-10 space-y-2">
          <p className="text-xs uppercase tracking-[0.45em] text-white/70">Playlist</p>
          <h3 className="text-xl font-semibold leading-tight text-white">{playlist.name}</h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 text-sm text-slate-200/80">
        <div className="space-y-3">
          {playlist.description ? <p className="text-slate-300/80">{playlist.description}</p> : null}
          <div className="grid grid-cols-2 gap-y-2 text-xs uppercase tracking-[0.25em] text-slate-400">
            <span>Tracks</span>
            <span className="text-right text-slate-200/80">{playlist.tracks}</span>
            <span>Duration</span>
            <span className="text-right text-slate-200/80">{playlist.duration}</span>
            <span>Updated</span>
            <span className="text-right text-slate-200/80">{playlist.updated}</span>
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
