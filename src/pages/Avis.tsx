import { useState } from "react";
import { SCSS } from "../utils/theme";
import EmptyState from "../components/EmptyState";
import type { AppData } from "../data/accountData";

interface AvisProps {
  data: AppData;
  setData: (updater: (prev: AppData) => AppData) => void;
}

export default function Avis({ data, setData }: AvisProps) {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);

  const avisList = data.avis || [];

  const submitFeedback = () => {
    if (!feedback.trim()) return;
    const newAvis = {
      id: Date.now().toString(),
      text: feedback,
      rating,
      date: new Date().toISOString(),
    };
    setData(d => ({
      ...d,
      avis: [...avisList, newAvis],
    }));
    setFeedback("");
    setRating(0);
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
        <div className="card fade-up">
          <div className="card-title">Laisser un avis</div>
          <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRating(star)}
                style={{
                  fontSize: 24,
                  color: star <= rating ? SCSS.accentAmber : SCSS.textMuted,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="Partagez votre avis sur trade-dashboard..."
            style={{
              width: "100%",
              minHeight: 100,
              borderRadius: SCSS.radiusSm,
              border: `1px solid ${SCSS.borderSub}`,
              background: SCSS.bgCard,
              color: SCSS.textPrimary,
              padding: 12,
              fontSize: 14,
              resize: "vertical",
            }}
          />
          <button
            className="btn-primary"
            onClick={submitFeedback}
            style={{ width: "100%", marginTop: 12 }}
            disabled={!feedback.trim()}
          >
            Envoyer l'avis
          </button>
        </div>

        <div className="card fade-up">
          <div className="card-title">Vos avis ({avisList.length})</div>
          {avisList.length === 0 ? (
            <EmptyState icon="💬" msg="Aucun avis" sub="Soyez le premier à laisser un avis !" />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {avisList.map((a: any) => (
                <div key={a.id} style={{ padding: 14, background: SCSS.bgCard, borderRadius: SCSS.radiusSm }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ color: SCSS.accentAmber }}>
                      {"★".repeat(a.rating)}{"☆".repeat(5 - a.rating)}
                    </div>
                    <div style={{ color: SCSS.textMuted, fontSize: 12 }}>
                      {new Date(a.date).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                  <p style={{ margin: 0, color: SCSS.textPrimary, fontSize: 14 }}>{a.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}