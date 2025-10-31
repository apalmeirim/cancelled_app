import { useEffect, useState } from "react";
import {
  redirectToSpotifyAuth,
  handleRedirectCallback,
  getStoredAccessToken,
  logoutSpotify,
} from "./utils/spotifyAuth";

export default function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      // Try to handle redirect (after login)
      const newToken = await handleRedirectCallback();
      if (newToken) return setToken(newToken);

      // Try existing stored token
      const savedToken = getStoredAccessToken();
      if (savedToken) setToken(savedToken);
    }
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-green-500">
        Spotify Playlist Cleaner
      </h1>

      {!token ? (
        <button
          onClick={redirectToSpotifyAuth}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition"
        >
          Connect with Spotify
        </button>
      ) : (
        <>
          <p className="text-gray-400 mb-4">
            ✅ Logged in! Next, we’ll load your playlists.
          </p>
          <button
            onClick={() => {
              logoutSpotify();
              setToken(null);
            }}
            className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 transition"
          >
            Log out
          </button>
        </>
      )}

      <footer className="mt-12 text-sm text-gray-600">
        Built with ❤️ React + Tailwind + GitHub Pages
      </footer>
    </div>
  );
}