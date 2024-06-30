import React from "react";

interface IInputProps {
  inputName: string;
  label: string;
  htmlFor: string;
  isRequired?: boolean;
  inputPattern?: string;
  title?: string;
  type?: "input" | "textarea";
}

const InputField = ({
  inputName,
  label,
  inputPattern,
  isRequired,
  htmlFor,
  title,
  type = "input",
  ...props
}: IInputProps) => {
  const sharedClasses =
    "cursor-pointer peer block text-xl w-64 p-2 bg-slate-700 text-slate-200 border-gray-500 border rounded border-opacity-50 outline-none focus:border-slate-200 placeholder-gray-300 placeholder-opacity-0 transition duration-200";

  return (
    <div className="relative my-6 flex justify-center">
      <div className="relative">
        {type === "input" ? (
          <input
            name={inputName}
            id={htmlFor}
            type="text"
            placeholder={label}
            required={isRequired}
            pattern={inputPattern}
            title={title}
            className={sharedClasses}
            {...props}
          />
        ) : (
          <textarea
            name={inputName}
            id={htmlFor}
            placeholder={label}
            className={sharedClasses}
            required={isRequired}
            {...props}
          ></textarea>
        )}
        <label
          htmlFor={htmlFor}
          className={`absolute left-2 top-2 z-10 origin-[0] -translate-y-8 scale-75 transform bg-slate-700 px-2 text-slate-200 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-10 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-primary-600 ${
            type === "textarea" ? "peer-focus:-top-4" : ""
          }`}
        >
          {label}
        </label>
      </div>
    </div>
  );
};

export default InputField;
