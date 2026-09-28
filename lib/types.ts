// Shapes mirror the relevant parts of an AssemblyAI transcript response
// (https://www.assemblyai.com/docs/api-reference/transcripts/get) so a real
// Playground/API result can be dropped into data.ts unchanged.

export type Word = {
  text: string;
  start: number; // milliseconds
  end: number; // milliseconds
  confidence: number; // 0–1
  speaker: string;
};

export type Utterance = {
  speaker: string;
  start: number;
  end: number;
  confidence: number;
  text: string;
  words: Word[];
};

export type Transcript = {
  id: string;
  audio_url: string | null;
  audio_duration: number; // seconds
  language_code: string;
  utterances: Utterance[];
};
