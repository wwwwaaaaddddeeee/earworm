// src/pages/api/spotify/now-playing.ts
import type { APIRoute } from "astro";
import { getNowPlaying } from "use-earworm/api";

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const track = await getNowPlaying({
      clientId: import.meta.env.SPOTIFY_CLIENT_ID,
      clientSecret: import.meta.env.SPOTIFY_CLIENT_SECRET,
      refreshToken: import.meta.env.SPOTIFY_REFRESH_TOKEN,
    });

    return new Response(JSON.stringify(track ?? { isPlaying: false }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=15",
      },
    });
  } catch {
    return new Response(JSON.stringify({ isPlaying: false }), {
      headers: { "Content-Type": "application/json" },
    });
  }
};
