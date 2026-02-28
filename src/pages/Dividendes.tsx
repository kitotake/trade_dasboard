// Legacy stub — kept for AppNavigator compatibility.
// The real implementation is in Dividends.tsx.
import type { FC } from "react";
import type { AppData } from "../data/accountData";
import Dividends from "./Dividends";

interface Props {
  data?: AppData;
  setData?: React.Dispatch<React.SetStateAction<AppData>>;
}

const Dividendes: FC<Props> = ({ data, setData }) => {
  if (!data || !setData) return null;
  return <Dividends data={data} setData={setData} />;
};

export default Dividendes;