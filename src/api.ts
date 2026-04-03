import type { SpotifyCredentials, SpotifyTrack } from "./types";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";
const SPOTIFY_RECENTLY_PLAYED_URL = "https://api.spotify.com/v1/me/player/recently-played?limit=1";

async function getAccessToken(credentials: SpotifyCredentials): Promise<string> {
  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(`${credentials.clientId}:${credentials.clientSecret}`),
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: credentials.refreshToken,
    }),
  });

  const data = await res.json();
  return data.access_token;
}

/**
 * Fetches the current or most recently played track from Spotify.
 * Use this in your API route handler.
 */
export async function getNowPlaying(credentials: SpotifyCredentials): Promise<SpotifyTrack | null> {
  const accessToken = await getAccessToken(credentials);
  const headers = { Authorization: `Bearer ${accessToken}` };

  // Try currently playing
  const nowRes = await fetch(SPOTIFY_NOW_PLAYING_URL, { headers });

  if (nowRes.status === 200) {
    const data = await nowRes.json();
    if (data.item) {
      return {
        isPlaying: data.is_playing,
        title: data.item.name,
        artist: data.item.artists.map((a: { name: string }) => a.name).join(", "),
        album: data.item.album.name,
        albumImageUrl: data.item.album.images[1]?.url ?? data.item.album.images[0]?.url,
        songUrl: data.item.external_urls.spotify,
        playedAt: new Date().toISOString(),
        progressMs: data.progress_ms ?? 0,
        durationMs: data.item.duration_ms ?? 0,
      };
    }
  }

  // Fall back to recently played
  const recentRes = await fetch(SPOTIFY_RECENTLY_PLAYED_URL, { headers });

  if (recentRes.status === 200) {
    const data = await recentRes.json();
    const item = data.items?.[0];
    if (item) {
      return {
        isPlaying: false,
        title: item.track.name,
        artist: item.track.artists.map((a: { name: string }) => a.name).join(", "),
        album: item.track.album.name,
        albumImageUrl: item.track.album.images[1]?.url ?? item.track.album.images[0]?.url,
        songUrl: item.track.external_urls.spotify,
        playedAt: item.played_at,
        progressMs: item.track.duration_ms ?? 0,
        durationMs: item.track.duration_ms ?? 0,
      };
    }
  }

  return null;
}
