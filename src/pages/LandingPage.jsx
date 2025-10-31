import { useNavigate } from "react-router-dom";
import FuzzyText from "../components/FuzzyText/FuzzyText";
import Button from "../components/ui/Button";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center gap-8 text-center">
      <div className="space-y-4">
        <FuzzyText
          className="mx-auto block"
          fontSize="clamp(3.5rem, 9vw, 6rem)"
          fontWeight={800}
          color="#9fffc7"
          hoverIntensity={0.65}
        >
          c@ncelled
        </FuzzyText>
        <p className="mx-auto max-w-md text-sm text-slate-200/80">
          Remove artists from your Spotify playlists in a couple of clicks.
        </p>
      </div>
      <Button variant="primary" size="lg" className="px-10" onClick={() => navigate("/login")}>Login</Button>
    </section>
  );
}