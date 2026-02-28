import React from "react";
import SummaryCard from "../components/SummaryCard";
import {
  peaSummary,
  currentAccountSummary,
  investments,
  dividends,
} from "../data/accountData";
import styles from "../styles/Accueil.module.scss";

const Accueil: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>Dashboard</h1>
      <div className={styles.summaries}>
        <SummaryCard title={peaSummary.title} value={peaSummary.value} />
        <SummaryCard
          title={currentAccountSummary.title}
          value={currentAccountSummary.value}
        />
      </div>

      <section>
        <h2>Investissements</h2>
        <ul>
          {investments.map((inv) => (
            <li key={inv.id}>
              {inv.name} – {inv.currentValue} €
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Dividendes</h2>
        <ul>
          {dividends.map((d) => (
            <li key={d.id}>
              {d.asset} – {d.amount} € ({d.date})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Accueil;
