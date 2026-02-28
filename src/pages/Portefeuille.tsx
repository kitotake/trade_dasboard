// Legacy stub — kept for AppNavigator compatibility.
// The real implementation is in Portfolio.tsx.
import React from "react";
import type { AppData } from "../data/accountData";
import Portfolio from "./Portfolio";

interface Props {
  data?: AppData;
  setData?: React.Dispatch<React.SetStateAction<AppData>>;
}

const Portefeuille: React.FC<Props> = ({ data, setData }) => {
  if (!data || !setData) return null;
  return <Portfolio data={data} setData={setData} />;
};

export default Portefeuille;