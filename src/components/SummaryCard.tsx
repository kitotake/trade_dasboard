import React from "react";
import styles from "../styles/SummaryCard.module.scss";

interface SummaryCardProps {
  title: string;
  value: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value }) => {
  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      <p>{value.toLocaleString(undefined, { minimumFractionDigits: 2 })} €</p>
    </div>
  );
};

export default SummaryCard;
