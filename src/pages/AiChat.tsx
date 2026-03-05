// ── src/pages/AiChat.tsx ──────────────────────────────────────────────────────
// ⚠️  SÉCURITÉ : VITE_ANTHROPIC_API_KEY est exposée côté client (bundle JS).
// En production, remplacez l'appel direct par un endpoint backend /api/chat
// qui détient la clé côté serveur. Ex. : Express, Next.js API route, Cloudflare Worker.
//
// Pour désactiver le warning en dev, ajoutez dans .env :
//   VITE_ANTHROPIC_API_KEY=sk-ant-...
//   VITE_USE_PROXY=false   ← mettre à true en prod pour pointer sur /api/chat

import { useState, useRef, useEffect } from "react";
import { SCSS } from "../utils/theme";
import { pct } from "../utils/helpers";
import type { AppData } from "../data/accountData";

interface AiChatProps {
  data: AppData;
  onClose: () => void;
}

// En prod, pointer ici vers votre propre endpoint backend
const PROXY_URL  = import.meta.env.VITE_CHAT_PROXY_URL as string | undefined;
const API_KEY    = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;
const USE_PROXY  = !!PROXY_URL;

/** Indique si la clé est exposée côté client sans proxy configuré */
const KEY_IS_EXPOSED = !!API_KEY && !USE_PROXY;

async function callClaude(
  systemPrompt: string,
  messages: { role: string; content: string }[]
): Promise<string> {
  const body = {
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    system: systemPrompt,
    messages,
  };

  const url = USE_PROXY ? PROXY_URL! : "https://api.anthropic.com/v1/messages";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (!USE_PROXY && API_KEY) {
    // Accès direct — clé exposée dans le bundle, à éviter en prod
    headers["x-api-key"] = API_KEY;
    headers["anthropic-version"] = "2023-06-01";
    headers["anthropic-dangerous-direct-browser-access"] = "true";
  }

  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message ?? `HTTP ${res.status}`);
  }
  return data.content?.[0]?.text ?? "Désolé, je n'ai pas pu répondre.";
}

const AiChat: React.FC<AiChatProps> = ({ data, onClose }) => {
  const [chatMsg, setChatMsg]   = useState("");
  const [history, setHistory]   = useState<{ role: string; text: string }[]>([
    { role: "ai", text: "Bonjour ! Je suis votre assistant financier trade-dashboard. Posez-moi n'importe quelle question sur votre portefeuille." },
  ]);
  const [typing, setTyping]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const isAvailable = USE_PROXY || !!API_KEY;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, typing]);

  const send = async () => {
    if (!chatMsg.trim() || !isAvailable) return;

    const msg = chatMsg;
    setChatMsg("");
    setError(null);
    setTyping(true);
    setHistory(h => [...h, { role: "user", text: msg }]);

    const investments = data.investments || [];
    const total = investments.reduce((s, i) => s + (Number(i.current) || 0), 0);
    const ctx = `Données utilisateur: portefeuille=${total}€, ${investments.length} positions: ${
      investments.map(i => `${i.name}(${pct(i.invested, i.current)}%)`).join(", ")
    }, dividendes totaux=${(data.dividends || []).reduce((s, d) => s + (Number(d.amount) || 0), 0)}€`;

    const systemPrompt = `Tu es un assistant financier expert pour un investisseur particulier français. ${ctx}. Réponds en français, de façon concise, précise et bienveillante.`;

    const apiMessages = history
      .filter((h, idx) => h.role !== "ai" || idx > 0)
      .map(h => ({ role: h.role === "ai" ? "assistant" : "user", content: h.text }));
    apiMessages.push({ role: "user", content: msg });

    try {
      const text = await callClaude(systemPrompt, apiMessages);
      setHistory(h => [...h, { role: "ai", text }]);
    } catch (err: any) {
      console.error("[AiChat]", err);
      const errMsg = err?.message ?? "Erreur inconnue";
      setError(`Erreur : ${errMsg}`);
      setHistory(h => [...h, { role: "ai", text: "Une erreur est survenue. Veuillez réessayer." }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div style={{
      position: "fixed", right: 24, bottom: 24, width: 380, height: 540,
      background: SCSS.bgSurface, border: `1px solid ${SCSS.borderSub}`,
      borderRadius: 20, display: "flex", flexDirection: "column", zIndex: 999,
      boxShadow: "0 24px 80px rgba(0,0,0,0.7)", overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 18px", borderBottom: `1px solid ${SCSS.borderSub}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "rgba(255,255,255,0.03)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: `linear-gradient(135deg, ${SCSS.accentCyan}, ${SCSS.accentViolet})`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17,
          }}>🤖</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Assistant IA</div>
            <div style={{ fontSize: 11, color: isAvailable ? SCSS.accentGreen : SCSS.accentRed, display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: isAvailable ? SCSS.accentGreen : SCSS.accentRed }} />
              {isAvailable ? "En ligne" : "Non configuré"}
            </div>
          </div>
        </div>
        <button className="btn-ghost" style={{ padding: "5px 11px" }} onClick={onClose}>✕</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 10 }}>

        {/* Warning clé exposée */}
        {KEY_IS_EXPOSED && (
          <div style={{
            background: "rgba(252,211,77,0.1)", border: `1px solid rgba(252,211,77,0.25)`,
            borderRadius: 10, padding: "10px 14px", fontSize: 12, color: SCSS.accentAmber,
          }}>
            ⚠️ <strong>Clé API exposée côté client.</strong> En production, utilisez un proxy backend et définissez <code>VITE_CHAT_PROXY_URL</code>.
          </div>
        )}

        {!isAvailable && (
          <div style={{
            background: "rgba(248,113,113,0.1)", border: `1px solid rgba(248,113,113,0.25)`,
            borderRadius: 10, padding: "10px 14px", fontSize: 12, color: SCSS.accentRed,
          }}>
            ❌ Aucune clé API configurée. Définissez <code>VITE_ANTHROPIC_API_KEY</code> dans <code>.env</code> ou configurez un proxy via <code>VITE_CHAT_PROXY_URL</code>.
          </div>
        )}

        {error && (
          <div style={{
            background: "rgba(248,113,113,0.1)", border: `1px solid rgba(248,113,113,0.25)`,
            borderRadius: 10, padding: "8px 12px", fontSize: 12, color: SCSS.accentRed,
          }}>
            {error}
          </div>
        )}

        {history.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div
              className={m.role === "ai" ? "bubble-ai" : "bubble-user"}
              style={{ maxWidth: "83%", padding: "10px 14px", fontSize: 13, lineHeight: 1.55 }}
            >
              {m.text}
            </div>
          </div>
        ))}

        {typing && (
          <div style={{
            display: "flex", gap: 5, padding: "10px 14px",
            background: "rgba(255,255,255,0.07)", borderRadius: "14px 14px 14px 4px", width: 60,
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: "50%", background: SCSS.accentCyan,
                animation: `pulseRing 1s ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "12px 14px", borderTop: `1px solid ${SCSS.borderSub}`, display: "flex", gap: 8 }}>
        <input
          value={chatMsg}
          onChange={e => setChatMsg(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
          placeholder={isAvailable ? "Posez une question…" : "Non disponible — clé API manquante"}
          style={{ flex: 1, borderRadius: 10 }}
          disabled={!isAvailable || typing}
        />
        <button
          className="btn-primary"
          style={{ padding: "0 16px", opacity: (!isAvailable || typing) ? 0.4 : 1 }}
          onClick={send}
          disabled={!isAvailable || typing}
        >➤</button>
      </div>
    </div>
  );
};

export default AiChat;