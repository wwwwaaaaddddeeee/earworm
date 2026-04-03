// app/api/spotify/now-playing/route.ts
import { getNowPlaying } from "earworm/api";

export async function GET() {
  try {
    const track = await getNowPlaying({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      refreshToken: process.env.SPOTIFY_REFRESH_TOKEN!,
    });

    return Response.json(track ?? { isPlaying: false }, {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=15" },
    });
  } catch {
    return Response.json({ isPlaying: false });
  }
}
