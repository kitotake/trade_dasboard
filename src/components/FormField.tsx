import type { FC } from "react";

interface FormFieldProps {
  label?: string;
  children: React.ReactNode;
}

const FormField: FC<FormFieldProps> = ({ label, children }) => {
  return (
    <div className="form-field">
      {label && <label className="form-label">{label}</label>}
      {children}
    </div>
  );
};

export default FormField;