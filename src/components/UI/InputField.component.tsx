import React from "react";
import { UseFormRegister, FieldError } from "react-hook-form";

// Predefined patterns
const PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
  // Add more predefined patterns as needed
};

type PatternKey = keyof typeof PATTERNS;

interface IInputProps {
  inputName: string;
  label: string;
  htmlFor: string;
  isRequired?: boolean;
  patternKey?: PatternKey;
  title?: string;
  type?: "input" | "textarea";
  register: UseFormRegister<any>;
  error?: FieldError;
}

const InputField = ({
  inputName,
  label,
  patternKey,
  isRequired,
  htmlFor,
  title,
  type = "input",
  register,
  error,
  ...props
}: IInputProps) => {
  const sharedClasses =
    "cursor-pointer peer block text-xl w-64 p-2 bg-gray-800 text-slate-200 border-gray-500 border rounded border-opacity-50 outline-none focus:border-slate-200 placeholder-gray-300 placeholder-opacity-0 transition duration-200";

  const getPatternRule = () => {
    if (!patternKey) return undefined;
    return {
      value: PATTERNS[patternKey],
      message: `Invalid ${patternKey} format`,
    };
  };

  return (
    <div className="relative my-2 flex flex-col items-center">
      <div className="relative">
        {type === "input" ? (
          <input
            id={htmlFor}
            type="text"
            placeholder={label}
            className={`${sharedClasses} ${error ? "border-red-500" : ""}`}
            {...register(inputName, {
              required: isRequired,
              pattern: getPatternRule(),
            })}
            {...props}
          />
        ) : (
          <textarea
            id={htmlFor}
            placeholder={label}
            className={`${sharedClasses} ${error ? "border-red-500" : ""}`}
            {...register(inputName, { required: isRequired })}
            {...props}
          ></textarea>
        )}
        <label
          htmlFor={htmlFor}
          className={`absolute cursor-pointer left-1 top-0 z-10 origin-[0] -translate-y-8 scale-75 transform bg-gray-800 px-2 text-slate-200 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-10 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-primary-600 peer-focus:bg-gray-800 ${
            type === "textarea" ? "cursor-pointer peer-focus:-top-4" : ""
          }`}
        >
          {label}
        </label> 
      </div>
      {error && (
        <p className="text-xs italic text-red-500 mt-2">{error.message}</p>
      )}
    </div>
  );
};

export default InputField;
