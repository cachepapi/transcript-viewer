"use client";

import { useEffect, useState } from "react";
import { Player } from "@/components/Player";
import { Transcript } from "@/components/Transcript";
import { transcript, speakerNames } from "@/lib/data";
import { usePlayback, formatTime } from "@/lib/playback";
import s from "./page.module.css";

export default function Page() {
  const durationMs = transcript.audio_duration * 1000;
  const hasAudio = Boolean(transcript.audio_url);
  const { currentMs, playing, toggle, seek, skip, audioRef } = usePlayback(durationMs, hasAudio);
  const [query, setQuery] = useState("");

  const speakers = Array.from(new Set(transcript.utterances.map((u) => u.speaker)));

  // Space toggles playback, arrows skip 5s, "/" focuses search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target?.tagName === "INPUT";
      if (e.key === "/" && !typing) {
        e.preventDefault();
        document.getElementById("search")?.focus();
      }
      if (typing) return;
      if (e.key === " ") {
        e.preventDefault();
        toggle();
      } else if (e.key === "ArrowRight") {
        skip(5000);
      } else if (e.key === "ArrowLeft") {
        skip(-5000);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, skip]);

  return (
    <main className={s.page}>
      {hasAudio && <audio ref={audioRef} src={transcript.audio_url ?? undefined} preload="metadata" />}

      <header className={s.header}>
        <div className={s.titleRow}>
          <h1 className={s.title}>Transcript</h1>
          <label className={s.search}>
            <SearchIcon />
            <input
              id="search"
              type="search"
              placeholder="Find in transcript"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Find in transcript"
            />
            <kbd className={`mono ${s.kbd}`}>/</kbd>
          </label>
        </div>
        <p className={s.summary}>
          <span className="mono">{formatTime(durationMs)}</span>
          <span className={s.sep} aria-hidden="true" />
          {speakers.length} speakers
          <span className={s.sep} aria-hidden="true" />
          {transcript.language_code.toUpperCase()}
          {!hasAudio && (
            <>
              <span className={s.sep} aria-hidden="true" />
              <span className={s.demo}>Simulated playback</span>
            </>
          )}
        </p>
      </header>

      <div className={s.sticky}>
        <Player currentMs={currentMs} durationMs={durationMs} playing={playing} onToggle={toggle} onSeek={seek} />
      </div>

      <section className={s.body} aria-label="Transcript">
        <Transcript
          utterances={transcript.utterances}
          speakerNames={speakerNames}
          currentMs={currentMs}
          query={query}
          onSeek={seek}
          onClearQuery={() => setQuery("")}
        />
      </section>

      <footer className={s.footer}>
        <span>
          Space plays, arrows skip 5s, click any word to jump. Dotted words are low confidence.
        </span>
      </footer>
    </main>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="6" cy="6" r="4" />
      <path d="M9 9l3.2 3.2" strokeLinecap="round" />
    </svg>
  );
}
