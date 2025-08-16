export type VideoRecord = {
  id: string;
  title: string;
  fileUri: string;
  sizeBytes: number | null;
  durationSeconds: number | null;
  createdAt: string;
  updatedAt: string;
};

export type SubtitleRecord = {
  id: string;
  videoId: string;
  fileUri: string;
  label: string | null; // e.g., "English"
  language: string | null; // e.g., "en"
  format: 'vtt' | 'srt';
  createdAt: string;
};

export type Cue = {
  start: number; // seconds
  end: number; // seconds
  text: string;
};