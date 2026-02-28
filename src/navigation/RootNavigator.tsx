import { useState } from "react";
import type { RootState } from "../utils/types";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";

type Props = {
  initial?: RootState;
};

export default function RootNavigator({ initial }: Props) {
  const [state, setState] = useState<RootState>(
    initial ?? { mode: "auth", entry: "welcome" }
  );

  const onAuthSuccess = () => {
    setState({ mode: "app", entry: "accueil" });
  };

  return (
    <div style={{ minHeight: "100%" }}>
      {state.mode === "auth" && (
        <AuthNavigator initial={state.entry as any} onAuthSuccess={onAuthSuccess} />
      )}
      {state.mode === "app" && (
        <AppNavigator initial={state.entry as any} onRouteChange={() => {}} />
      )}
    </div>
  );
}
