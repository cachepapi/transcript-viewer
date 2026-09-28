# Transcript viewer

A small prototype of a synced transcript view, built on the AssemblyAI transcript response format. Next.js 15, React 19, TypeScript, CSS Modules. No component library.

Live: _add your Vercel URL here_

## What it improves

After spending time in the Playground, three things stood out in the transcript view:

1. **The transcript and the audio don't talk to each other.** You can read, or you can listen, but reading along while listening means keeping your own place. This viewer highlights the current turn and the current word, and any word or speaker line is a seek target.
2. **Confidence is in the JSON but not in the UI.** The API returns per-word confidence, which is the single most useful signal for deciding where to double-check. Low-confidence words get a quiet dotted underline; hover shows the score, click plays it back.
3. **Long transcripts have no way in.** Search filters turns and highlights the match inside the text, and the active turn keeps tracking playback so you can find a phrase and keep listening from there.

## Design decisions

- **One reading measure.** 720px column, 16px Plex Sans at 1.65 line-height. Transcripts are long-form reading, so the body is set like an article, not like a data table.
- **Meta line is quiet, text is loud.** Speaker and timestamp sit above the text in 13px/12px, so the eye lands on the content first.
- **Tabular timestamps in a mono face.** A column of times you can scan is the difference between a tool and a document.
- **Active turn: surface tint + accent left rule.** Enough to find at a glance, not so much that it competes with the search highlight. Turns already played step back to a secondary text color, giving a sense of progress without a second progress bar.
- **Word highlight in the accent tint** so the two highlights (position, search) are always distinguishable.
- **Confidence markers are subtle on purpose.** Most words are right. If the marker shouted, people would stop trusting the whole transcript.
- **Tokens for everything.** All values in `app/globals.css`. Retheming or matching a house design system means editing one file.
- **Keyboard first.** Space plays, arrows skip five seconds, `/` focuses search, every control has a visible focus ring, reduced-motion is respected.
- **Empty, no-results and simulated states** are designed, not left to chance.

## Use your own recording

1. Transcribe a file in the AssemblyAI Playground with speaker labels on, or call the API with `speaker_labels: true`.
2. Copy the `utterances` array from the JSON response into `lib/data.ts`, replacing the sample.
3. Set `audio_url` to a public URL of the same audio and `audio_duration` to its length in seconds.
4. Update `speakerNames` if you know who's who.

If `audio_url` is empty the viewer runs on a simulated clock so the interaction can still be demonstrated.

## Run it

```bash
npm install
npm run dev
```

Deploy by pushing to GitHub and importing the repo in Vercel; no configuration needed.

## Not in this version

- Editing speaker labels or reassigning turns (changes the data; needs a proper design)
- Waveform in the scrubber
- Exporting a clip from a selection
