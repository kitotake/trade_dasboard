import type { FC, ReactNode } from "react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
}

const Modal: FC<ModalProps> = ({ title, onClose, children, width = 520 }) => {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:1000,
      display:"flex", alignItems:"center", justifyContent:"center", padding:20,
      backdropFilter:"blur(6px)" }}>
      <div className="card fade-up" style={{ width, maxHeight:"90vh", overflowY:"auto", position:"relative" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
          <span style={{ fontSize:17, fontWeight:700 }}>{title}</span>
          <button className="btn-ghost" onClick={onClose} style={{ padding:"6px 12px" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
