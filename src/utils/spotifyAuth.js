const CLIENT_ID = 'd0d4e197a37f49dca9d350e7a8d44e6d';
const REDIRECT_URI = "https://apalmeirim.github.io/cancelled_app/dashboard";
const SCOPES = [
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-private",
  "playlist-modify-public",
];

// Generate random string for verifier
function generateRandomString(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

// Hash + base64URL encode
async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const base64 = btoa(String.fromCharCode(...hashArray))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return base64;
}

// Start login
export async function redirectToSpotifyAuth() {
  const codeVerifier = generateRandomString(128);
  localStorage.setItem("spotify_code_verifier", codeVerifier);

  const codeChallenge = await sha256(codeVerifier);
  const state = crypto.randomUUID();
  const scope = SCOPES.join(" ");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope,
    redirect_uri: REDIRECT_URI,
    state,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  });

  window.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// Handle redirect back from Spotify
export async function handleRedirectCallback(code) {
  if (!code) return null;

  const codeVerifier = localStorage.getItem("spotify_code_verifier");
  if (!codeVerifier) {
    console.error("[SpotifyAuth] Missing code verifier. Cannot exchange code.");
    return null;
  }

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  let data;
  try {
    data = await response.json();
  } catch (err) {
    console.error("[SpotifyAuth] Failed to parse token response", err);
    return null;
  }

  if (!response.ok) {
    console.error("[SpotifyAuth] Token exchange failed", data);
    return null;
  }

  if (data.access_token) {
    localStorage.setItem("spotify_access_token", data.access_token);
    localStorage.removeItem("spotify_code_verifier");
  }

  return data.access_token ?? null;
}

// Helper: get stored token
export function getStoredAccessToken() {
  return localStorage.getItem("spotify_access_token");
}

// Optional: log out
export function logoutSpotify() {
  localStorage.removeItem("spotify_access_token");
  localStorage.removeItem("spotify_code_verifier");
}
