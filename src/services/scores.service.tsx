import {
    addDoc,
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";

export type ScoreInput = {
  mode: string; // 'classic' | 'rapid' | 'sudden'
  language: string; // 'English' | 'Nepali' | 'Hindi' | 'Mixed'
  score: number;
  correct: number;
  total: number;
};

export type ScoreRecord = ScoreInput & {
  id: string;
  createdAt: Date | null;
};

// Scores are stored per user at: users/{uid}/scores/{scoreId}
const scoresRef = (uid: string) => collection(db, "users", uid, "scores");

// Save one finished game for the logged-in user.
export async function saveScore(input: ScoreInput): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("You must be logged in to save a score.");

  await addDoc(scoresRef(uid), {
    ...input,
    createdAt: serverTimestamp(),
  });
}

// Get the most recent games (newest first).
export async function getRecentScores(max = 50): Promise<ScoreRecord[]> {
  const uid = auth.currentUser?.uid;
  if (!uid) return [];

  const snap = await getDocs(
    query(scoresRef(uid), orderBy("createdAt", "desc"), limit(max)),
  );

  return snap.docs.map((d) => {
    const data = d.data();
    const ts = data.createdAt as Timestamp | null | undefined;
    return {
      id: d.id,
      mode: data.mode,
      language: data.language,
      score: data.score,
      correct: data.correct,
      total: data.total,
      createdAt: ts ? ts.toDate() : null,
    };
  });
}

// Summary numbers shown on Home and Profile.
export function computeStats(records: ScoreRecord[]) {
  const gamesPlayed = records.length;
  const totalScore = records.reduce((sum, r) => sum + r.score, 0);
  const bestScore = records.reduce((max, r) => Math.max(max, r.score), 0);
  const correct = records.reduce((sum, r) => sum + r.correct, 0);
  const total = records.reduce((sum, r) => sum + r.total, 0);
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return { gamesPlayed, totalScore, bestScore, accuracy };
}
