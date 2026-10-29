import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
// @ts-ignore - the React Native persistence helper is missing from the default type definitions
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyB5H6bv_2CkssA5rW4qHiQvq9KaXVEV54A",
  authDomain: "music-app-3b1fc.firebaseapp.com",
  projectId: "music-app-3b1fc",
  storageBucket: "music-app-3b1fc.firebasestorage.app",
  messagingSenderId: "1003933376979",
  appId: "1:1003933376979:web:8c757c361890a586860f26",
  measurementId: "G-ZYWZ4TSL59",
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error(
    "Firebase config is missing. Create a .env file (see .env.example) and restart with: npx expo start -c",
  );
}

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Persistence keeps the user logged in between app launches.
// initializeAuth throws if called twice (fast refresh), so fall back to getAuth.
function createAuth() {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return getAuth(app);
  }
}

export const auth = createAuth();
export const db = getFirestore(app);
