import Modal from "../ui/Modal";
import Card from "../ui/Card";
import Button from "../ui/Button";

export default function TutorialModal({
  isOpen,
  onClose,
  onCreateCopy,
  isCreatingCopy,
  creationStatus,
}) {
  const statusClass =
    creationStatus?.type === "error"
      ? "border-red-400/40 bg-red-500/10 text-red-200"
      : "border-white/20 bg-white/10 text-gray-200";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tutorial: Cleaning your Liked Songs"
      description="Spotify treats Liked Songs differently than playlists. Follow this guide to work around the limitation."
      className="w-full max-w-5xl"
    >
      <div className="grid gap-6 md:grid-cols-3">
        <Card padding="md" className="flex flex-col gap-4 border-white/10 bg-black/60 text-center">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Step 1</p>
            <h3 className="text-lg font-semibold text-white">Clone your liked songs automatically</h3>
            <p className="text-sm text-gray-300">
              We&apos;ll create a playlist named <span className="font-semibold">&quot;ls copy&quot;</span> that
              mirrors every track in your Liked Songs.
            </p>
          </div>
          <div className="space-y-3">
            <Button
              variant="primary"
              size="sm"
              onClick={onCreateCopy}
              disabled={!onCreateCopy || isCreatingCopy}
              className="w-full justify-center"
            >
              {isCreatingCopy ? "Creating..." : 'Create "ls copy"'}
            </Button>
            {creationStatus ? (
              <p className={`rounded-xl border px-4 py-3 text-xs ${statusClass}`}>
                {creationStatus.message}
              </p>
            ) : null}
            <p className="text-[0.7rem] uppercase tracking-[0.4em] text-gray-500">
              Requires Spotify to authorise liked songs access
            </p>
          </div>
        </Card>

        <Card padding="md" className="flex flex-col gap-4 border-white/10 bg-black/60 text-center">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Step 2</p>
            <h3 className="text-lg font-semibold text-white">Use Cancelled as usual</h3>
            <p className="text-sm text-gray-300">
              After the playlist is created, refresh your dashboard playlists and run scans exactly as you would for any
              other collection.
            </p>
          </div>
        </Card>

        <Card padding="md" className="flex flex-col gap-4 border-white/10 bg-black/60 text-center">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Step 3</p>
            <h3 className="text-lg font-semibold text-white">Replace your Liked Songs</h3>
            <p className="text-sm text-gray-300">
              Once you&apos;re happy with the results, clear your Liked Songs and add back the tracks from{" "}
              <span className="font-semibold">&quot;ls copy&quot;</span> so the cleaned list becomes your new library.
            </p>
          </div>
        </Card>
      </div>
    </Modal>
  );
}
