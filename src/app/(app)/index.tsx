import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { isModeId, MODES } from "../../constants/game";
import { palette } from "../../constants/palette";
import { useAuth } from "../../context/auth-context";
import {
  computeStats,
  getRecentScores,
  ScoreRecord,
} from "../../services/scores.service";

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};

const formatDate = (d: Date | null) =>
  d
    ? d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : "Just now";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={s.stat}>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [records, setRecords] = useState<ScoreRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setRecords(await getRecentScores(50));
    } catch (e: any) {
      setError(e?.message ?? "Could not load your records.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Reload whenever Home comes into focus (e.g. after finishing a game)
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const stats = computeStats(records);
  const name = user?.displayName || user?.email?.split("@")[0] || "Player";

  return (
    <ScrollView
      contentContainerStyle={s.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            load();
          }}
        />
      }
    >
      <Text style={s.greeting}>{greeting()},</Text>
      <Text style={s.name}>{name}</Text>

      <View style={s.statsRow}>
        <Stat label="Games" value={stats.gamesPlayed} />
        <View style={s.vline} />
        <Stat label="Best score" value={stats.bestScore} />
        <View style={s.vline} />
        <Stat label="Accuracy" value={`${stats.accuracy}%`} />
      </View>

      <TouchableOpacity
        style={s.cta}
        onPress={() => router.navigate("/quiz")}
        activeOpacity={0.85}
      >
        <Text style={s.ctaText}>Start playing</Text>
        <Ionicons name="arrow-forward" size={18} color="#fff" />
      </TouchableOpacity>

      <Text style={s.section}>Recent games</Text>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 24 }} color={palette.text} />
      ) : error ? (
        <Text style={s.empty}>Couldn't load records. {error}</Text>
      ) : records.length === 0 ? (
        <Text style={s.empty}>
          No games yet. Play your first quiz and it will show up here.
        </Text>
      ) : (
        records.slice(0, 8).map((r) => {
          const mode = isModeId(r.mode) ? MODES[r.mode] : MODES.classic;
          return (
            <View key={r.id} style={s.row}>
              <View style={{ flex: 1 }}>
                <Text style={s.rowTitle}>
                  {mode.title} · {r.language}
                </Text>
                <Text style={s.rowSub}>
                  {formatDate(r.createdAt)} · {r.correct}/{r.total} correct
                </Text>
              </View>
              <Text style={s.rowScore}>{r.score}</Text>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 24, paddingBottom: 40 },
  greeting: { fontSize: 15, color: palette.muted },
  name: {
    fontSize: 32,
    fontWeight: "800",
    color: palette.text,
    marginTop: 2,
    letterSpacing: -0.5,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 28,
    paddingVertical: 18,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: palette.border,
  },
  stat: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 24, fontWeight: "800", color: palette.text },
  statLabel: { fontSize: 12, color: palette.muted, marginTop: 2 },
  vline: { width: 1, height: 32, backgroundColor: palette.border },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: palette.primary,
    paddingVertical: 18,
    paddingHorizontal: 22,
    borderRadius: 16,
    marginTop: 24,
  },
  ctaText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  section: {
    fontSize: 13,
    fontWeight: "700",
    color: palette.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 36,
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  rowTitle: { fontSize: 16, fontWeight: "600", color: palette.text },
  rowSub: { fontSize: 13, color: palette.muted, marginTop: 2 },
  rowScore: { fontSize: 20, fontWeight: "800", color: palette.text },
  empty: { color: palette.muted, lineHeight: 22, marginTop: 12 },
});
