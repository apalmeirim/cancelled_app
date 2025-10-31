import Modal from "../ui/Modal";
import Card from "../ui/Card";

const tutorialSteps = [
  {
    title: "Save your liked songs to a new playlist",
    description:
      "In Spotify, select all tracks from Liked Songs and add them to a brand new playlist. This gives us a playlist endpoint to work with.",
  },
  {
    title: "Sync the new playlist inside Cancelled",
    description:
      "Return to the dashboard, refresh playlists, and find the temporary playlist you just created.",
  },
  {
    title: "Run the artist removal scan",
    description:
      "Select the temporary playlist along with any others you want to clean, then add the artists you’d like to remove.",
  },
  {
    title: "Review the generated removal list",
    description:
      "We’ll list every match we can delete. You’ll get the option to approve each track before syncing back to Spotify.",
  },
  {
    title: "Resync or delete the temporary playlist",
    description:
      "Once you’re done, either keep the curated playlist or sync it back into Liked Songs manually.",
  },
];

export default function TutorialModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tutorial: Cleaning your Liked Songs"
      description="Spotify treats Liked Songs differently than playlists. Follow this guide to work around the limitation."
      className="max-w-4xl"
    >
      <div className="grid gap-6">
        {tutorialSteps.map((step, index) => (
          <Card
            key={step.title}
            padding="md"
            className="grid gap-4 border-white/10 bg-slate-950/55 md:grid-cols-[minmax(0,1fr)_250px]"
          >
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-200/70">
                Step {index + 1}
              </p>
              <h3 className="text-lg font-semibold text-emerald-100">{step.title}</h3>
              <p className="text-sm text-slate-200/80">{step.description}</p>
            </div>
            <div className="flex min-h-[160px] items-center justify-center rounded-2xl border border-dashed border-white/12 bg-slate-900/60 text-xs font-medium uppercase tracking-[0.35em] text-slate-400/80">
              Screenshot placeholder
            </div>
          </Card>
        ))}
      </div>
    </Modal>
  );
}
