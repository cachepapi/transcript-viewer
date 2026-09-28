"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** 83500 → "1:23" */
export function formatTime(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type Playback = {
  currentMs: number;
  playing: boolean;
  toggle: () => void;
  seek: (ms: number) => void;
  skip: (deltaMs: number) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
};

/**
 * Drives the playhead. If an <audio> element with a source is attached, its
 * clock is used. Otherwise a simulated clock advances in real time so the
 * transcript can be demonstrated without an audio file.
 */
export function usePlayback(durationMs: number, hasAudio: boolean): Playback {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentMs, setCurrentMs] = useState(0);
  const [playing, setPlaying] = useState(false);
  const frame = useRef<number>(0);
  const last = useRef<number>(0);

  // Real audio: mirror the element's clock.
  useEffect(() => {
    const el = audioRef.current;
    if (!hasAudio || !el) return;
    const onTime = () => setCurrentMs(el.currentTime * 1000);
    const onEnd = () => setPlaying(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnd);
    };
  }, [hasAudio]);

  // Simulated audio: advance with requestAnimationFrame.
  useEffect(() => {
    if (hasAudio || !playing) return;
    last.current = performance.now();
    const tick = (now: number) => {
      const delta = now - last.current;
      last.current = now;
      setCurrentMs((t) => {
        const next = t + delta;
        if (next >= durationMs) {
          setPlaying(false);
          return durationMs;
        }
        return next;
      });
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [playing, hasAudio, durationMs]);

  const seek = useCallback(
    (ms: number) => {
      const clamped = Math.min(Math.max(ms, 0), durationMs);
      setCurrentMs(clamped);
      if (hasAudio && audioRef.current) audioRef.current.currentTime = clamped / 1000;
    },
    [durationMs, hasAudio]
  );

  const toggle = useCallback(() => {
    if (hasAudio && audioRef.current) {
      const el = audioRef.current;
      if (el.paused) void el.play();
      else el.pause();
    }
    setPlaying((p) => {
      // Restart from the top if the clock ran out.
      if (!p && currentMs >= durationMs) seek(0);
      return !p;
    });
  }, [hasAudio, currentMs, durationMs, seek]);

  const skip = useCallback((delta: number) => seek(currentMs + delta), [seek, currentMs]);

  return { currentMs, playing, toggle, seek, skip, audioRef };
}
