"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Utterance, Word } from "@/lib/types";
import { formatTime } from "@/lib/playback";
import s from "./Transcript.module.css";

const LOW_CONFIDENCE = 0.7;

type Props = {
  utterances: Utterance[];
  speakerNames: Record<string, string>;
  currentMs: number;
  query: string;
  onSeek: (ms: number) => void;
  onClearQuery: () => void;
};

export function Transcript({
  utterances,
  speakerNames,
  currentMs,
  query,
  onSeek,
  onClearQuery,
}: Props) {
  const q = query.trim().toLowerCase();

  const visible = useMemo(
    () => (q ? utterances.filter((u) => u.text.toLowerCase().includes(q)) : utterances),
    [utterances, q]
  );

  const activeIndex = utterances.findIndex((u) => currentMs >= u.start && currentMs < u.end);
  const activeRef = useRef<HTMLLIElement | null>(null);

  // Keep the active turn in view without yanking the page when it's already visible.
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIndex]);

  if (utterances.length === 0) {
    return (
      <div className={s.empty} role="status">
        <p className={s.emptyTitle}>No transcript yet</p>
        <p className={s.emptyBody}>Upload audio or paste a transcript response to see it here.</p>
      </div>
    );
  }

  if (visible.length === 0) {
    return (
      <div className={s.empty} role="status">
        <p className={s.emptyTitle}>No matches for &ldquo;{query.trim()}&rdquo;</p>
        <p className={s.emptyBody}>Try a shorter phrase, or check the spelling.</p>
        <button type="button" className={s.clear} onClick={onClearQuery}>
          Clear search
        </button>
      </div>
    );
  }

  return (
    <ol className={s.list}>
      {visible.map((u) => {
        const i = utterances.indexOf(u);
        const active = i === activeIndex;
        const past = currentMs >= u.end;
        return (
          <li
            key={u.start}
            ref={active ? activeRef : null}
            className={`${s.turn} ${active ? s.active : ""} ${past ? s.past : ""}`}
            aria-current={active ? "true" : undefined}
          >
            <div className={s.meta}>
              <button
                type="button"
                className={s.speaker}
                onClick={() => onSeek(u.start)}
                aria-label={`${speakerNames[u.speaker] ?? u.speaker}, play from ${formatTime(u.start)}`}
              >
                <span className={`${s.dot} ${s[`dot${u.speaker}`] ?? ""}`} aria-hidden="true" />
                {speakerNames[u.speaker] ?? u.speaker}
              </button>
              <span className={`mono ${s.time}`}>{formatTime(u.start)}</span>
            </div>
            <p className={s.text}>
              {u.words.map((w, wi) => (
                <WordSpan key={w.start} word={w} currentMs={currentMs} query={q} onSeek={onSeek} last={wi === u.words.length - 1} />
              ))}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

function WordSpan({
  word,
  currentMs,
  query,
  onSeek,
  last,
}: {
  word: Word;
  currentMs: number;
  query: string;
  onSeek: (ms: number) => void;
  last: boolean;
}) {
  const spoken = currentMs >= word.start && currentMs < word.end + 40;
  const uncertain = word.confidence < LOW_CONFIDENCE;
  const matches = query.length > 0 && word.text.toLowerCase().replace(/[^\w']/g, "").includes(query.replace(/[^\w' ]/g, ""));

  return (
    <>
      <span
        role="button"
        tabIndex={-1}
        className={[s.word, spoken ? s.spoken : "", uncertain ? s.uncertain : "", matches ? s.match : ""].join(" ")}
        onClick={() => onSeek(word.start)}
        title={uncertain ? `Low confidence (${Math.round(word.confidence * 100)}%). Click to listen.` : undefined}
      >
        {word.text}
      </span>
      {last ? null : " "}
    </>
  );
}
