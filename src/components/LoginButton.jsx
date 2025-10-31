import {useEffect} from 'react';
import { getAuthUrl, extractAccessTokenFromUrl } from '../utils/spotifyAuth';   

export default function LoginButton({ onToken }) {
    useEffect(() => {
        const token = extractAccessTokenFromUrl();
        if (token) {
            window.location.hash = '';
            onLogin(token);
        }
    }, [onToken]);

    return (
        <button
        onClick ={() => { window.location.href = getAuthUrl(); }}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition-all"
        >
        Connect with Spotify
        </button>
        );
    }