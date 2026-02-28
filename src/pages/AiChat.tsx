import { useState, useRef, useEffect } from "react";
import { SCSS } from "../utils/theme";
import { pct } from "../utils/helpers";
import type { AppData } from "../data/accountData";

interface AiChatProps {
  data: AppData;
  onClose: () => void;
}

const AiChat: React.FC<AiChatProps> = ({ data, onClose }) => {
  const [chatMsg, setChatMsg] = useState("");
  const [history, setHistory] = useState<{ role: string; text: string }[]>([
    { role: "ai", text: "Bonjour ! Je suis votre assistant financier TradePulse. Posez-moi n'importe quelle question sur votre portefeuille." }
  ]);
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [history, typing]);

  const send = async () => {
    if (!chatMsg.trim()) return;
    const msg = chatMsg;
    setChatMsg("");
    setTyping(true);
    setHistory(h => [...h, { role: "user", text: msg }]);

    const investments = data.investments || [];
    const total = investments.reduce((s, i) => s + (Number(i.current) || 0), 0);
    const ctx = `Données utilisateur: portefeuille=${total}€, ${investments.length} positions: ${investments.map(i => `${i.name}(${pct(i.invested, i.current)}%)`).join(", ")}, dividendes totaux=${(data.dividends || []).reduce((s, d) => s + (Number(d.amount) || 0), 0)}€`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `Tu es un assistant financier expert pour un investisseur particulier français. ${ctx}. Réponds en français, de façon concise, précise et bienveillante.`,
          messages: [
            ...history
              .filter((h, idx) => h.role !== "ai" || idx > 0)
              .map(h => ({ role: h.role === "ai" ? "assistant" : "user", content: h.text })),
            { role: "user", content: msg }
          ]
        })
      });
      const d2 = await res.json();
      setHistory(h => [...h, { role: "ai", text: d2.content?.[0]?.text || "Désolé, je n'ai pas pu répondre." }]);
    } catch {
      setHistory(h => [...h, { role: "ai", text: "Erreur de connexion. Réessayez." }]);
    }
    setTyping(false);
  };

  return (
    <div style={{
      position: "fixed", right: 24, bottom: 24, width: 380, height: 540,
      background: SCSS.bgSurface, border: `1px solid ${SCSS.borderSub}`,
      borderRadius: 20, display: "flex", flexDirection: "column", zIndex: 999,
      boxShadow: "0 24px 80px rgba(0,0,0,0.7)", overflow: "hidden",
    }}>
      <div style={{
        padding: "14px 18px", borderBottom: `1px solid ${SCSS.borderSub}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "rgba(255,255,255,0.03)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: `linear-gradient(135deg, ${SCSS.accentCyan}, ${SCSS.accentViolet})`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17
          }}>🤖</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Assistant IA</div>
            <div style={{ fontSize: 11, color: SCSS.accentGreen, display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: SCSS.accentGreen, animation: "blink 2s infinite" }} />
              En ligne
            </div>
          </div>
        </div>
        <button className="btn-ghost" style={{ padding: "5px 11px" }} onClick={onClose}>✕</button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
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
            background: "rgba(255,255,255,0.07)", borderRadius: "14px 14px 14px 4px", width: 60
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: "50%", background: SCSS.accentCyan,
                animation: `pulseRing 1s ${i * 0.2}s infinite`
              }} />
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ padding: "12px 14px", borderTop: `1px solid ${SCSS.borderSub}`, display: "flex", gap: 8 }}>
        <input
          value={chatMsg}
          onChange={e => setChatMsg(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Posez une question…"
          style={{ flex: 1, borderRadius: 10 }}
        />
        <button className="btn-primary" style={{ padding: "0 16px" }} onClick={send}>➤</button>
      </div>
    </div>
  );
};

export default AiChat;