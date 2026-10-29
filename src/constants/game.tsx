export type ModeId = "classic" | "rapid" | "sudden";

export type GameMode = {
  id: ModeId;
  title: string;
  emoji: string;
  description: string;
  questions: number; // number of questions
  maxMs: number; // max total listening time per question (ms)
  penaltyPerSec: number; // points lost per second listened
  endsOnWrong: boolean; // game ends at the first wrong answer
};

export const MODES: Record<ModeId, GameMode> = {
  classic: {
    id: "classic",
    title: "Classic",
    emoji: "🎧",
    description:
      "Listen up to 10 seconds per song. The sooner you guess, the more points you get.",
    questions: 5,
    maxMs: 10000,
    penaltyPerSec: 10,
    endsOnWrong: false,
  },
  rapid: {
    id: "rapid",
    title: "Rapid Fire",
    emoji: "⚡",
    description:
      "10 quick songs with only 5 seconds of listening each. Points drop fast, so guess quickly!",
    questions: 10,
    maxMs: 5000,
    penaltyPerSec: 20,
    endsOnWrong: false,
  },
  sudden: {
    id: "sudden",
    title: "Sudden Death",
    emoji: "💀",
    description:
      "One wrong answer ends the game. See how long your streak can last.",
    questions: 20,
    maxMs: 10000,
    penaltyPerSec: 10,
    endsOnWrong: true,
  },
};

export const MODE_LIST: GameMode[] = [MODES.classic, MODES.rapid, MODES.sudden];

export const LANGUAGES = ["English", "Nepali", "Hindi", "Mixed"] as const;
export type LanguageChoice = (typeof LANGUAGES)[number];

export const LANGUAGE_EMOJI: Record<LanguageChoice, string> = {
  English: "🇬🇧",
  Nepali: "🇳🇵",
  Hindi: "🇮🇳",
  Mixed: "🎲",
};

// Type guards for values that arrive as route params (always strings)
export const isModeId = (v: unknown): v is ModeId =>
  typeof v === "string" && v in MODES;

export const isLanguage = (v: unknown): v is LanguageChoice =>
  typeof v === "string" && (LANGUAGES as readonly string[]).includes(v);

// 100 points, minus `penaltyPerSec` for every full second listened (never below 10)
export const calcPoints = (listenedMs: number, mode: GameMode) =>
  Math.max(10, 100 - Math.floor(listenedMs / 1000) * mode.penaltyPerSec);
