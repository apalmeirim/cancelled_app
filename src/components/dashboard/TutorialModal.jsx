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
      title='tutorial: cleaning your Liked Songs'
      description="spotify treats Liked Songs differently than playlists. follow this guide to work around the limitation."
      className="w-full max-w-5xl"
    >
      <div className="grid gap-6 md:grid-cols-3">
        <Card padding="md" className="flex flex-col gap-4 border-white/10 bg-black/60 text-center">
          <div className="space-y-3">
            <p className="text-xs tracking-[0.35em] text-gray-500">step 1</p>
            <h3 className="text-lg font-semibold text-white">clone</h3>
            <p className="text-sm text-gray-300">
              creates a playlist named <span className="font-semibold">&quot;ls copy&quot;</span> that
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
            <p className="text-[0.7rem] tracking-[0.4em] text-gray-500">
              requires Spotify to authorise Liked Songs access
            </p>
          </div>
        </Card>

        <Card padding="md" className="flex flex-col gap-4 border-white/10 bg-black/60 text-center">
          <div className="space-y-3">
            <p className="text-xs tracking-[0.35em] text-gray-500">step 2</p>
            <h3 className="text-lg font-semibold text-white">run</h3>
            <p className="text-sm text-gray-300">
              after the playlist is created, refresh your dashboard playlists and run scans exactly as you would for any
              other collection.
            </p>
          </div>
        </Card>

        <Card padding="md" className="flex flex-col gap-4 border-white/10 bg-black/60 text-center">
          <div className="space-y-3">
            <p className="text-xs tracking-[0.35em] text-gray-500">step 3</p>
            <h3 className="text-lg font-semibold text-white">replace</h3>
            <p className="text-sm text-gray-300">
              remove all songs from your current Liked Songs library, and then copy and paste the new playlist into the empty library.
            </p>
          </div>
        </Card>
      </div>
    </Modal>
  );
}
