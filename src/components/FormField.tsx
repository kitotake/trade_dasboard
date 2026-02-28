import React from "react";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ label, children }) => (
  <div style={{ marginBottom: 16 }}>
    <label className="form-label">{label}</label>
    {children}
  </div>
);

export default FormField;
