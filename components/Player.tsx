"use client";

import { formatTime } from "@/lib/playback";
import s from "./Player.module.css";

type Props = {
  currentMs: number;
  durationMs: number;
  playing: boolean;
  onToggle: () => void;
  onSeek: (ms: number) => void;
};

export function Player({ currentMs, durationMs, playing, onToggle, onSeek }: Props) {
  const pct = durationMs ? (currentMs / durationMs) * 100 : 0;

  return (
    <div className={s.bar}>
      <button
        type="button"
        className={s.play}
        onClick={onToggle}
        aria-label={playing ? "Pause" : "Play"}
        aria-pressed={playing}
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>

      <span className={`mono ${s.time}`}>{formatTime(currentMs)}</span>

      <div className={s.track}>
        <input
          type="range"
          className={s.range}
          min={0}
          max={durationMs}
          step={100}
          value={currentMs}
          onChange={(e) => onSeek(Number(e.target.value))}
          aria-label="Playback position"
          aria-valuetext={formatTime(currentMs)}
          style={{ ["--pct" as string]: `${pct}%` }}
        />
      </div>

      <span className={`mono ${s.time} ${s.total}`}>{formatTime(durationMs)}</span>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M3 2.2v9.6a.6.6 0 0 0 .9.5l7.6-4.8a.6.6 0 0 0 0-1L3.9 1.7a.6.6 0 0 0-.9.5z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <rect x="2.5" y="2" width="3.4" height="10" rx="0.8" fill="currentColor" />
      <rect x="8.1" y="2" width="3.4" height="10" rx="0.8" fill="currentColor" />
    </svg>
  );
}
