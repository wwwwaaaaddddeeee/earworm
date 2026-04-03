export interface SpotifyTrack {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
  playedAt: string;
  progressMs: number;
  durationMs: number;
}

export interface EarwormProps {
  /** API endpoint that returns SpotifyTrack JSON. Default: "/api/spotify/now-playing" */
  endpoint?: string;
  /** Polling interval in ms. Default: 10000 */
  pollInterval?: number;
  /** Active color for "LISTENING NOW" text. Default: "#75FF4F" */
  activeColor?: string;
  /** Inactive color for "LAST LISTEN" text. Default: "#E2E2E2" */
  inactiveColor?: string;
  /** Font family. Default: "inherit" */
  fontFamily?: string;
}

export interface SpotifyCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}
