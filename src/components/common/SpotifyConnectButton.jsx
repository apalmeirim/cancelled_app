import Button from "../ui/Button";
import spotifyLogo from "../../assets/spotify_logo.png";

export default function SpotifyConnectButton({
  onClick,
  label = "Connect with Spotify",
  subLabel,
  icon,
  disabled,
}) {
  const iconSlot =
    icon ??
    (
      <span className="flex h-6 w-6 items-center justify-center">
        <img src={spotifyLogo} alt="Spotify" className="h-5 w-5" loading="lazy" />
      </span>
    );

  return (
    <div className="inline-flex flex-col gap-2">
      <Button
        onClick={onClick}
        disabled={disabled}
        variant="primary"
        size="lg"
        leading={iconSlot}
        className="group px-8 py-3.5 shadow-[0_20px_45px_rgba(255,255,255,0.1)] transition-transform duration-200 hover:-translate-y-0.5"
      >
        {label}
      </Button>
      {subLabel ? (
        <span className="text-xs font-medium uppercase tracking-[0.35em] text-gray-400">
          {subLabel}
        </span>
      ) : null}
    </div>
  );
}
