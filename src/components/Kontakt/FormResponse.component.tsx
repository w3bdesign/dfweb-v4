import React from "react";

interface FormResponseProps {
  message: string;
}

const FormResponse: React.FC<FormResponseProps> = ({ message }) => {
  return (
    <div className="text-center text-white">
      <p>{message}</p>
    </div>
  );
};

export default FormResponse;
