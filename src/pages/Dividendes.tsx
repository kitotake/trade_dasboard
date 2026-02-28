import React from "react";
import { dividends } from "../data/accountData";
import styles from "../styles/Dividendes.module.scss";

const Dividendes: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>Dividendes</h1>
      <ul>
        {dividends.map((d) => (
          <li key={d.id}>
            {d.asset} – {d.amount} € ({d.date})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dividendes;
