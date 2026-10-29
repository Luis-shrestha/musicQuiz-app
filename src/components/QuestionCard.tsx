import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Song } from "../data/songs";

export const MAX_MS = 10000; // max total listening per question
export const calcPoints = (ms: number) =>
  Math.max(10, 100 - Math.floor(ms / 1000) * 10);

type Props = {
  song: Song;
  options: Song[];
  isLast: boolean;
  onCorrect: (points: number) => void;
  onNext: () => void;
};

// Render with key={questionIndex} so every question gets a fresh player.
export default function QuestionCard({
  song,
  options,
  isLast,
  onCorrect,
  onNext,
}: Props) {
  const player = useAudioPlayer({ uri: song.url });
  const status = useAudioPlayerStatus(player);
  const [listened, setListened] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const seeked = useRef(false);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true });
  }, []);

  // Count listening time while audio is actually playing
  useEffect(() => {
    if (!status.playing) return;
    const id = setInterval(() => setListened((l) => l + 100), 100);
    return () => clearInterval(id);
  }, [status.playing]);

  // Stop at the cap
  useEffect(() => {
    if (listened >= MAX_MS && status.playing) player.pause();
  }, [listened, status.playing, player]);

  const togglePlay = async () => {
    if (selected) return;
    if (status.playing) {
      player.pause();
      return;
    }
    if (listened >= MAX_MS) return;
    if (!seeked.current) {
      seeked.current = true;
      await player.seekTo((song.startMs ?? 0) / 1000);
    }
    player.play();
  };

  const answer = (option: Song) => {
    if (selected) return;
    player.pause();
    setSelected(option.id);
    if (option.id === song.id) onCorrect(calcPoints(listened));
  };

  const capped = listened >= MAX_MS;

  return (
    <View>
      <View style={s.player}>
        <TouchableOpacity
          style={[s.play, capped && { opacity: 0.4 }]}
          onPress={togglePlay}
          disabled={!status.isLoaded}
        >
          <Text style={s.playText}>{status.playing ? "⏸" : "▶"}</Text>
        </TouchableOpacity>
        <Text style={s.time}>
          {(Math.min(listened, MAX_MS) / 1000).toFixed(1)}s / {MAX_MS / 1000}s
        </Text>
        <Text style={s.points}>Worth {calcPoints(listened)} pts</Text>
      </View>

      {options.map((o) => {
        const isCorrect = o.id === song.id;
        const bg = selected
          ? isCorrect
            ? "#2ecc71"
            : o.id === selected
              ? "#e74c3c"
              : "#f2f2f2"
          : "#f2f2f2";
        return (
          <TouchableOpacity
            key={o.id}
            style={[s.option, { backgroundColor: bg }]}
            onPress={() => answer(o)}
          >
            <Text style={s.optionText}>{o.title}</Text>
          </TouchableOpacity>
        );
      })}

      {selected && (
        <TouchableOpacity style={s.btn} onPress={onNext}>
          <Text style={s.btnText}>{isLast ? "Finish" : "Next"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  player: { alignItems: "center", marginBottom: 24 },
  play: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#6C47FF",
    justifyContent: "center",
    alignItems: "center",
  },
  playText: { fontSize: 36, color: "#fff" },
  time: { marginTop: 10, fontSize: 16 },
  points: { marginTop: 4, fontWeight: "700", color: "#6C47FF" },
  option: { padding: 16, borderRadius: 10, marginBottom: 10 },
  optionText: { fontSize: 16 },
  btn: {
    backgroundColor: "#6C47FF",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
