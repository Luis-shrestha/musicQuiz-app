import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { auth } from "./firebase";

const ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-email": "That email address looks invalid.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/user-not-found": "No account found with that email.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/network-request-failed":
    "Network error. Check your internet connection.",
  "auth/operation-not-allowed":
    "Email/Password sign-in is not enabled in Firebase.",
};

export function getAuthErrorMessage(error: unknown): string {
  const e = error as { code?: string; message?: string };
  console.log("AUTH ERROR:", e?.code, e?.message);
  const code = e?.code ?? "";
  return (
    ERROR_MESSAGES[code] ??
    `Something went wrong (${code || e?.message || "unknown"}).`
  );
}

export const signUp = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email.trim(), password);

export const logIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email.trim(), password);

export const logOut = () => signOut(auth);

export const resetPassword = (email: string) =>
  sendPasswordResetEmail(auth, email.trim());
