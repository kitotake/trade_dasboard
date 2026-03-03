import { useState } from "react";
import type { RootState } from "../utils/types";
import { loadSession, clearSession, type Session } from "../utils/authStorage";
import AuthNavigator from "./AuthNavigator";
import App from "../App";

type Props = {
  initial?: RootState;
};

export default function RootNavigator({ initial }: Props) {
  // Restaurer la session si elle existe dans le localStorage
  const existingSession = loadSession();

  const [state, setState] = useState<RootState>(
    initial ?? (existingSession
      ? { mode: "app", entry: "dashboard" }
      : { mode: "auth", entry: "welcome" }
    )
  );

  const [session, setSession] = useState<Session | null>(existingSession);

  const onAuthSuccess = () => {
    // La session a déjà été sauvegardée par Login/Register
    const s = loadSession();
    setSession(s);
    setState({ mode: "app", entry: "dashboard" });
  };

  const onLogout = () => {
    clearSession();
    setSession(null);
    setState({ mode: "auth", entry: "login" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#08090D" }}>
      {state.mode === "auth" && (
        <AuthNavigator initial={state.entry as any} onAuthSuccess={onAuthSuccess} />
      )}
      {state.mode === "app" && (
        <App session={session} onLogout={onLogout} />
      )}
    </div>
  );
}