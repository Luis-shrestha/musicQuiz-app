import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import QuestionCard from "../../components/QuestionCard";
import { Song, SONGS } from "../../data/songs";

const TOTAL_QUESTIONS = 5;

const shuffle = <T,>(a: T[]): T[] => [...a].sort(() => Math.random() - 0.5);

type Question = { song: Song; options: Song[] };

function buildQuestions(language: string): Question[] {
  const pool =
    language === "Mixed" ? SONGS : SONGS.filter((s) => s.language === language);
  return shuffle(pool)
    .slice(0, TOTAL_QUESTIONS)
    .map((song) => ({
      song,
      options: shuffle([
        song,
        ...shuffle(pool.filter((p) => p.id !== song.id)).slice(0, 3),
      ]),
    }));
}

export default function Quiz() {
  const router = useRouter();
  const { language = "Mixed" } = useLocalSearchParams<{ language?: string }>();
  const [questions] = useState(() => buildQuestions(language));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (finished || questions.length === 0) {
    return (
      <View style={s.center}>
        <Text style={s.big}>
          {questions.length === 0 ? "No songs found" : "Quiz complete!"}
        </Text>
        <Text style={s.score}>{score} points</Text>
        <TouchableOpacity style={s.btn} onPress={() => router.back()}>
          <Text style={s.btnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const q = questions[index];

  return (
    <View style={s.container}>
      <Text style={s.progress}>
        Question {index + 1}/{questions.length} • Score: {score}
      </Text>
      <QuestionCard
        key={index}
        song={q.song}
        options={q.options}
        isLast={index + 1 >= questions.length}
        onCorrect={(pts) => setScore((v) => v + pts)}
        onNext={() =>
          index + 1 >= questions.length
            ? setFinished(true)
            : setIndex(index + 1)
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  progress: { fontSize: 15, color: "#555", marginBottom: 16 },
  big: { fontSize: 28, fontWeight: "700" },
  score: {
    fontSize: 40,
    fontWeight: "800",
    color: "#6C47FF",
    marginVertical: 20,
  },
  btn: {
    backgroundColor: "#6C47FF",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "stretch",
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
