import React from "react";
import { Investment } from "../data/accountData";
import styles from "../styles/DetailsInvestissement.module.scss";

interface Props {
  investment: Investment;
}

const DetailsInvestissement: React.FC<Props> = ({ investment }) => {
  return (
    <div className={styles.container}>
      <h1>Détails de {investment.name}</h1>
      <p>Montant investi : {investment.investedAmount} €</p>
      <p>Valeur actuelle : {investment.currentValue} €</p>
      <p>Performance : {investment.performancePercent} %</p>
      <p>Historique : (vide)</p>
    </div>
  );
};

export default DetailsInvestissement;
