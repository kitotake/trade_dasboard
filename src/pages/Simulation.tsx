import React, { useState } from "react";
import EmptyState from "../components/EmptyState";
import KpiCard from "../components/KpiCard";
import FormField from "../components/FormField";
import { SCSS } from "../utils/theme";
import { fmtE } from "../utils/helpers";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import type { AppData } from "../data/accountData";

interface SimulationProps {
  // data unused for now
  data?: AppData;
}

const Simulation: React.FC<SimulationProps> = () => {
  const [sim, setSim] = useState({ initial:"", monthly:"", rate:"7", years:"10" });
  const [result, setResult] = useState<any>(null);

  const run = () => {
    const P = parseFloat(sim.initial) || 0;
    const m = parseFloat(sim.monthly) || 0;
    const r = parseFloat(sim.rate) / 100 / 12;
    const n = parseInt(sim.years) * 12;
    const points: any[] = [];
    let val = P;
    for (let i = 0; i <= n; i++) {
      if (i > 0) val = val * (1 + r) + m;
      if (i % 12 === 0) points.push({ label:`An ${i/12}`, value: Math.round(val), invested: P + m*i });
    }
    setResult({ final: Math.round(val), points, totalInvested: P + m*n, gain: Math.round(val) - P - m*n });
  };

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:20, alignItems:"start" }}>
        <div className="card fade-up">
          <div className="card-title">⚙️ Paramètres</div>
          <FormField label="Capital initial (€)"><input type="number" placeholder="0" value={sim.initial} onChange={e => setSim(s=>({...s,initial:e.target.value}))} /></FormField>
          <FormField label="Versement mensuel (€)"><input type="number" placeholder="0" value={sim.monthly} onChange={e => setSim(s=>({...s,monthly:e.target.value}))} /></FormField>
          <FormField label="Rendement annuel estimé (%)"><input type="number" placeholder="7" value={sim.rate} onChange={e => setSim(s=>({...s,rate:e.target.value}))} /></FormField>
          <FormField label="Durée (années)"><input type="number" placeholder="10" value={sim.years} onChange={e => setSim(s=>({...s,years:e.target.value}))} /></FormField>
          <button className="btn-primary" style={{ width:"100%", marginTop:8 }} onClick={run}>🚀 Simuler</button>
        </div>

        <div>
          {!result ? (
            <div className="card"><EmptyState icon="🔬" msg="Configurez la simulation" sub="Entrez vos paramètres et lancez la simulation" /></div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
                <KpiCard icon="🏆" label="Capital final" value={fmtE(result.final)} color={SCSS.accentGreen} trend="up" />
                <KpiCard icon="💸" label="Total investi" value={fmtE(result.totalInvested)} color={SCSS.accentViolet} />
                <KpiCard icon="✨" label="Gain des intérêts" value={fmtE(result.gain)} color={SCSS.accentAmber} trend="up" />
              </div>
              <div className="card fade-up">
                <div className="card-title">Projection sur {sim.years} ans</div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={result.points}>
                    <defs>
                      <linearGradient id="gSim" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={SCSS.accentGreen} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={SCSS.accentGreen} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="label" stroke="rgba(255,255,255,0.18)" fontSize={11} />
                    <YAxis stroke="rgba(255,255,255,0.18)" fontSize={11} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ background:"#1a1d2e", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#fff", fontSize:13 }} formatter={v => [fmtE(v)]} />
                    <Area type="monotone" dataKey="value" stroke={SCSS.accentGreen} strokeWidth={2} fill="url(#gSim)" name="Capital" />
                    <Area type="monotone" dataKey="invested" stroke={SCSS.accentViolet} strokeWidth={1.5} fill="none" strokeDasharray="5 5" name="Investi" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Simulation;
