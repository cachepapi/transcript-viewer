import type { Transcript, Utterance, Word } from "./types";

// To use your own recording: paste the `utterances` array from an AssemblyAI
// transcript response (Playground → JSON, or GET /v2/transcript/{id}) in place
// of the sample below, set `audio_url`, and delete `synth`.

/** Builds an utterance with evenly distributed word timings. Demo only. */
function synth(
  speaker: string,
  start: number,
  end: number,
  text: string,
  uncertain: number[] = []
): Utterance {
  const tokens = text.split(" ");
  const slot = (end - start) / tokens.length;
  const words: Word[] = tokens.map((t, i) => ({
    text: t,
    start: Math.round(start + i * slot),
    end: Math.round(start + (i + 1) * slot) - 40,
    confidence: uncertain.includes(i) ? 0.52 : 0.96,
    speaker,
  }));
  return { speaker, start, end, confidence: 0.94, text, words };
}

export const transcript: Transcript = {
  id: "sample-design-review",
  audio_url: null, // set to an mp3/wav URL to drive playback from real audio
  audio_duration: 138,
  language_code: "en",
  utterances: [
    synth("A", 400, 6200, "Okay, so I've got the Playground open. Walk me through what you changed since Tuesday."),
    synth("B", 6600, 15900, "Two things. The transcript now highlights word by word as the audio plays, and low-confidence words get a small marker so you know where to double-check.", [14, 15]),
    synth("A", 16400, 21000, "The marker is subtle. Is that on purpose?"),
    synth("B", 21300, 32800, "Yes. Most of the transcript is right, so the marker only needs to be visible when you're looking for it. If it shouted, people would stop trusting the whole thing.", [7]),
    synth("A", 33500, 41900, "Fair. What happens when I click a word? Because in the old view I kept trying to do that and nothing happened."),
    synth("B", 42200, 50100, "It seeks the audio to that word. Same for the speaker line, which jumps to the start of the turn. Space plays and pauses, arrows skip five seconds."),
    synth("A", 50600, 57300, "And search? Support keeps asking for a way to find a phrase in a forty minute call.", [11, 12]),
    synth("B", 57800, 68000, "Search filters the turns and highlights the match inside the text. The active segment still tracks the audio, so you can find a phrase, click it, and keep listening from there."),
    synth("A", 68500, 76200, "I like that the timestamps line up. That was driving me a little crazy before."),
    synth("B", 76600, 84400, "Tabular numerals in a mono face. Small thing, but a column of times you can scan is the difference between a tool and a document."),
    synth("A", 85000, 94700, "Last one. Diarization sometimes gets a speaker wrong. Can I fix it here or do I have to go back to the API?", [2]),
    synth("B", 95200, 106800, "Not in this version. I'd want to design that properly. Renaming speakers is easy, but reassigning a turn changes the data, and we'd need to decide whether that goes back to the transcript record."),
    synth("A", 107400, 114000, "Okay. Ship the viewer, and write up the speaker editing question as a follow-up."),
    synth("B", 114500, 122900, "Will do. I'll also add the empty and error states before it goes out. Right now the happy path is the only path."),
    synth("A", 123400, 128500, "Good. Thanks, this is a real improvement."),
    synth("B", 129000, 134600, "Thanks. I'll send the link once it's deployed."),
  ],
};

/** Display names for diarization labels. Swap for real names when known. */
export const speakerNames: Record<string, string> = {
  A: "Speaker A",
  B: "Speaker B",
};
