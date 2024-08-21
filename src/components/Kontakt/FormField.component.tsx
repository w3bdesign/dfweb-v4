import React from "react";
import InputField from "@/components/UI/InputField.component";

interface FormFieldProps {
  name: string;
  label: string;
  htmlFor: string;
  isRequired?: boolean;
  inputPattern?: RegExp;
  title?: string;
  type?: "input" | "textarea";
  register: any;
  error?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  htmlFor,
  isRequired,
  inputPattern,
  title,
  type = "input",
  register,
  error,
}) => {
  return (
    <div className="my-4">
      <InputField
        name={name}
        label={label}
        htmlFor={htmlFor}
        isRequired={isRequired}
        inputPattern={inputPattern}
        title={title}
        type={type}
        register={register}
        error={error}
      />
    </div>
  );
};

export default FormField;
