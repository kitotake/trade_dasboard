import React from "react";
import { investments } from "../data/accountData";
import styles from "../styles/Portefeuille.module.scss";

const Portefeuille: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>Portefeuille</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Actif</th>
            <th>Investi</th>
            <th>Valeur actuelle</th>
            <th>Performance</th>
          </tr>
        </thead>
        <tbody>
          {investments.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.name}</td>
              <td>{inv.investedAmount} €</td>
              <td>{inv.currentValue} €</td>
              <td>{inv.performancePercent} %</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Portefeuille;
