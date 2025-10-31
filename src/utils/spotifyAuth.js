const CLIENT_ID = '07218c6f90be4c9aa05dda9c17a63f3a';
const REDIRECT_URI = 'https://apalmeirim.github.io/cancelled_app/';
const SCOPES = [
    "playlist-read-private",
    "playlist-read-collaborative",
    "playlist-modify-private",
    "playlist-modify-public", 
];

export function getAuthUrl() {
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: 'token',
        redirect_uri: REDIRECT_URI,
        scope: SCOPES.join(' '),
        state: crypto.randomUUID(),
    });
    return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export function extractAccessTokenFromUrl() {
    const hash  = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params.get('access_token');
}

