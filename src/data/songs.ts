export type Language = "English" | "Nepali" | "Hindi";

export type Song = {
  id: string;
  language: Language;
  title: string;
  url: string;
  startMs?: number;
};

// Replace the urls with your own hosted audio files.
export const SONGS: Song[] = [
  {
    id: "e1",
    language: "English",
    title: "Song English 1",
    url: "https://example.com/audio/e1.mp3",
    startMs: 0,
  },
  {
    id: "e2",
    language: "English",
    title: "Song English 2",
    url: "https://example.com/audio/e2.mp3",
    startMs: 15000,
  },
  {
    id: "e3",
    language: "English",
    title: "Song English 3",
    url: "https://example.com/audio/e3.mp3",
    startMs: 20000,
  },
  {
    id: "e4",
    language: "English",
    title: "Song English 4",
    url: "https://example.com/audio/e4.mp3",
    startMs: 10000,
  },
  {
    id: "n1",
    language: "Nepali",
    title: "Song Nepali 1",
    url: "https://example.com/audio/n1.mp3",
    startMs: 0,
  },
  {
    id: "n2",
    language: "Nepali",
    title: "Song Nepali 2",
    url: "https://example.com/audio/n2.mp3",
    startMs: 12000,
  },
  {
    id: "n3",
    language: "Nepali",
    title: "Song Nepali 3",
    url: "https://example.com/audio/n3.mp3",
    startMs: 8000,
  },
  {
    id: "n4",
    language: "Nepali",
    title: "Song Nepali 4",
    url: "https://example.com/audio/n4.mp3",
    startMs: 5000,
  },
  {
    id: "h1",
    language: "Hindi",
    title: "Song Hindi 1",
    url: "https://example.com/audio/h1.mp3",
    startMs: 0,
  },
  {
    id: "h2",
    language: "Hindi",
    title: "Song Hindi 2",
    url: "https://example.com/audio/h2.mp3",
    startMs: 20000,
  },
  {
    id: "h3",
    language: "Hindi",
    title: "Song Hindi 3",
    url: "https://example.com/audio/h3.mp3",
    startMs: 10000,
  },
  {
    id: "h4",
    language: "Hindi",
    title: "Song Hindi 4",
    url: "https://example.com/audio/h4.mp3",
    startMs: 6000,
  },
];
