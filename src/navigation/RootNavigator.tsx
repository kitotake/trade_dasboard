import { useState } from "react";
import type { RootState } from "../utils/types";
import AuthNavigator from "./AuthNavigator";
import App from "../App";

type Props = {
  initial?: RootState;
};

export default function RootNavigator({ initial }: Props) {
  const [state, setState] = useState<RootState>(
    initial ?? { mode: "auth", entry: "welcome" }
  );

  const onAuthSuccess = () => {
    setState({ mode: "app", entry: "dashboard" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#08090D" }}>
      {state.mode === "auth" && (
        <AuthNavigator initial={state.entry as any} onAuthSuccess={onAuthSuccess} />
      )}
      {state.mode === "app" && (
        <App />
      )}
    </div>
  );
}