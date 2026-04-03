"use client";

import { useEffect, useState, useMemo } from "react";
import type { SpotifyTrack, EarwormProps } from "./types";

function SpotifyLogo({ color = "#999" }: { color?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.502 17.305a.748.748 0 0 1-1.03.249c-2.82-1.723-6.37-2.113-10.553-1.158a.75.75 0 0 1-.334-1.462c4.573-1.045 8.497-.595 11.668 1.34a.75.75 0 0 1 .25 1.031zm1.47-3.267a.937.937 0 0 1-1.287.31c-3.228-1.984-8.15-2.56-11.966-1.4a.938.938 0 0 1-.543-1.796c4.36-1.324 9.778-.682 13.486 1.598a.937.937 0 0 1 .31 1.288zm.127-3.403C15.95 8.603 9.27 8.39 5.4 9.56a1.125 1.125 0 0 1-.652-2.153C9.2 6.072 16.56 6.32 20.436 8.97a1.125 1.125 0 0 1-1.337 1.665z"
        fill={color}
      />
    </svg>
  );
}

export default function Earworm({
  endpoint = "/api/spotify/now-playing",
  pollInterval = 10_000,
  activeColor = "#75FF4F",
  inactiveColor = "#E2E2E2",
  fontFamily = "inherit",
}: EarwormProps) {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [localProgress, setLocalProgress] = useState(0);

  const fetchTrack = async () => {
    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.title) {
        setTrack(data);
        setLocalProgress(data.progressMs);
        setError(false);
      } else {
        setTrack(null);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrack();
    const interval = setInterval(fetchTrack, pollInterval);
    return () => clearInterval(interval);
  }, [endpoint, pollInterval]);

  useEffect(() => {
    if (!track?.isPlaying) return;
    const interval = setInterval(() => {
      setLocalProgress((p) => Math.min(p + 1000, track.durationMs));
    }, 1000);
    return () => clearInterval(interval);
  }, [track?.isPlaying, track?.durationMs]);

  if (loading) {
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 16,
          borderRadius: 16,
          padding: "12px 20px",
          background: "rgba(245, 245, 245, 0.5)",
          border: "0.5px solid #E2E2E2",
          width: 420,
          maxWidth: "100%",
          height: 56,
          fontFamily,
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: 16, background: "rgba(0,0,0,0.08)" }} />
        <div style={{ width: 40, height: 40, borderRadius: 6, background: "rgba(0,0,0,0.05)" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ height: 12, width: 96, borderRadius: 4, background: "rgba(0,0,0,0.05)" }} />
          <div style={{ height: 10, width: 64, borderRadius: 4, background: "rgba(0,0,0,0.04)" }} />
        </div>
      </div>
    );
  }

  if (error || !track) return null;

  return (
    <a
      href={track.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "12px 16px",
        borderRadius: 16,
        textDecoration: "none",
        background: "transparent",
        border: "none",
        color: "inherit",
        fontFamily,
        fontSize: 12,
        transition: "transform 0.3s ease-out",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.005)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      {/* Status line */}
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, transform: "scale(0.85)", transformOrigin: "left center" }}>
        <span style={{ display: "inline-flex", alignItems: "center", lineHeight: 0 }}>
          <SpotifyLogo color="#DADADA" />
        </span>
        <span style={{
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: "0.08em",
          color: track.isPlaying ? activeColor : inactiveColor,
          fontFamily: "monospace",
          textShadow: track.isPlaying ? `0 0 8px ${activeColor}80, 0 0 20px ${activeColor}4D` : "none",
          transition: "color 0.3s ease, text-shadow 0.3s ease",
        }}>
          {track.isPlaying ? "LISTENING NOW" : "LAST LISTEN"}
        </span>
      </span>

      {/* Song info */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 16 }}>
        <img
          src={track.albumImageUrl}
          alt={track.album}
          width={40}
          height={40}
          style={{ borderRadius: 6, flexShrink: 0 }}
        />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minWidth: 0, flexShrink: 0 }}>
          <span style={{ fontWeight: 500, fontSize: 13, color: "#000", maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {track.title}
          </span>
          <span style={{ fontSize: 11, color: "#999", maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {track.artist}
          </span>
        </div>
      </div>
    </a>
  );
}
