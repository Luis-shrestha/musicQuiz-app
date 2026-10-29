import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GameMode, MODE_LIST } from "../../constants/game";
import { palette } from "../../constants/palette";

const COMING_SOON = [
  {
    emoji: "📅",
    title: "Daily Challenge",
    text: "One new set of songs every day.",
  },
  {
    emoji: "👥",
    title: "Play with Friends",
    text: "Challenge friends and compare scores.",
  },
  {
    emoji: "🎤",
    title: "Artist Round",
    text: "Guess the singer instead of the song.",
  },
];

function ModeRow({ mode, onPlay }: { mode: GameMode; onPlay: () => void }) {
  return (
    <View style={s.modeRow}>
      <View style={s.modeHeader}>
        <Text style={s.emoji}>{mode.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={s.modeTitle}>{mode.title}</Text>
          <Text style={s.modeMeta}>
            {mode.questions} questions · {mode.maxMs / 1000}s per song
          </Text>
        </View>
      </View>
      <Text style={s.modeText}>{mode.description}</Text>
      <TouchableOpacity style={s.playBtn} onPress={onPlay} activeOpacity={0.85}>
        <Text style={s.playText}>Play</Text>
        <Ionicons name="arrow-forward" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

export default function Explore() {
  const router = useRouter();

  const play = (mode: GameMode) =>
    router.push({
      pathname: "/(app)/quiz",
      params: { mode: mode.id, language: "Mixed" },
    });

  return (
    <ScrollView contentContainerStyle={s.content}>
      <Text style={s.intro}>
        Pick a mode and jump in. Songs are mixed from all languages.
      </Text>

      <Text style={s.section}>Game modes</Text>
      {MODE_LIST.map((m) => (
        <ModeRow key={m.id} mode={m} onPlay={() => play(m)} />
      ))}

      <Text style={s.section}>Coming soon</Text>
      {COMING_SOON.map((c) => (
        <View key={c.title} style={s.soonRow}>
          <Text style={s.emoji}>{c.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.soonTitle}>{c.title}</Text>
            <Text style={s.modeMeta}>{c.text}</Text>
          </View>
          <Text style={s.badge}>Soon</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 24, paddingBottom: 40 },
  intro: { fontSize: 15, color: palette.muted, lineHeight: 22 },
  section: {
    fontSize: 13,
    fontWeight: "700",
    color: palette.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 28,
    marginBottom: 4,
  },
  emoji: { fontSize: 26, marginRight: 14 },

  modeRow: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  modeHeader: { flexDirection: "row", alignItems: "center" },
  modeTitle: { fontSize: 18, fontWeight: "700", color: palette.text },
  modeMeta: { fontSize: 13, color: palette.muted, marginTop: 2 },
  modeText: {
    fontSize: 14,
    color: palette.text,
    lineHeight: 21,
    marginTop: 10,
  },
  playBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: palette.primary,
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 14,
  },
  playText: { color: "#fff", fontSize: 15, fontWeight: "700" },

  soonRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
    opacity: 0.55,
  },
  soonTitle: { fontSize: 16, fontWeight: "600", color: palette.text },
  badge: {
    fontSize: 12,
    fontWeight: "700",
    color: palette.muted,
    backgroundColor: palette.primarySoft,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
});
