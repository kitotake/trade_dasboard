import { useState } from "react";
import type { AuthRoute } from "../utils/types";
import WelcomeScreen from "../auth/WelcomeScreen";
import LoginScreen from "../auth/LoginScreen";
import RegisterScreen from "../auth/RegisterScreen";

type Props = {
  initial?: AuthRoute;
  onAuthSuccess?: () => void; // called when login/register succeeded
  onSwitchToApp?: (entry?: string) => void;
};

export default function AuthNavigator({ initial = "welcome", onAuthSuccess }: Props) {
  const [route, setRoute] = useState<AuthRoute>(initial);

  const handleAuthSuccess = () => {
    onAuthSuccess?.();
  };

  return (
    <div>
      {route === "welcome" && (
        <WelcomeScreen onContinue={() => setRoute("login")} />
      )}
      {route === "login" && (
        <LoginScreen onLogin={handleAuthSuccess} onSwitchToRegister={() => setRoute("register")} />
      )}
      {route === "register" && (
        <RegisterScreen onRegister={handleAuthSuccess} onSwitchToLogin={() => setRoute("login")} />
      )}

      <div style={{ position: "fixed", left: 12, bottom: 12 }}>
        <button onClick={() => setRoute("welcome")}>Accueil</button>
        <button onClick={() => setRoute("login")}>Connexion</button>
        <button onClick={() => setRoute("register")}>Inscription</button>
      </div>
    </div>
  );
}
