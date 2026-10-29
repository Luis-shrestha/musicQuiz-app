import { Redirect } from "expo-router";
import { useAuth } from "../context/auth-context";

// Any unknown or currently-unavailable route (like "/" while logged out)
// ends up here and gets sent to a valid screen.
export default function NotFound() {
  const { user } = useAuth();
  return <Redirect href={user ? "/quiz" : "/login"} />;
}
