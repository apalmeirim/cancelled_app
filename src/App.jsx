import { useState } from "react";
import LoginButton from "./components/LoginButton";

export default function App() {
  const [token, setToken] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-3xl font-bold mb-6 text-green-500">
        Spotify Playlist Cleaner
      </h1>

      {!token ? (
        <LoginButton onToken={setToken} />
      ) : (
        <p className="text-gray-400">
          Logged in! Next, we’ll load your playlists.
        </p>
      )}

      <footer className="mt-12 text-sm text-gray-600">
        Built with ❤️ React + Tailwind + GitHub Pages
      </footer>
    </div>
  );
}
