import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  getAuthErrorMessage,
  logIn,
  resetPassword,
  signUp,
} from "../../services/auth.service";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email || !password)
      return Alert.alert("Enter your email and password");
    setBusy(true);
    try {
      if (isSignup) await signUp(email, password);
      else await logIn(email, password);
      // No navigation here: the protected routes switch to Home once the user is set.
    } catch (e) {
      Alert.alert("Error", getAuthErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const forgotPassword = async () => {
    if (!email) return Alert.alert("Enter your email first");
    try {
      await resetPassword(email);
      Alert.alert("Check your inbox", "We sent you a password reset link.");
    } catch (e) {
      Alert.alert("Error", getAuthErrorMessage(e));
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>🎵 Music Quiz</Text>
      <TextInput
        style={s.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={s.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={s.btn} onPress={submit} disabled={busy}>
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={s.btnText}>{isSignup ? "Sign up" : "Log in"}</Text>
        )}
      </TouchableOpacity>
      {!isSignup && (
        <TouchableOpacity onPress={forgotPassword}>
          <Text style={s.link}>Forgot password?</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
        <Text style={s.link}>
          {isSignup ? "Have an account? Log in" : "New here? Sign up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: "#6C47FF",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
  },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  link: { textAlign: "center", marginTop: 16, color: "#6C47FF" },
});
