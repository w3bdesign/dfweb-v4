import React from "react";
import { Meta } from "@ladle/react";
import InputField from "@/components/UI/InputField.component";
import { useForm } from "react-hook-form";
import "@/app/globals.css";

export default {
  title: "UI/InputField",
  component: InputField,
  parameters: {
    layout: "centered",
  },
} as Meta;

// Create a story wrapper to provide the react-hook-form context
const InputFieldStory = ({
  name = "exampleField",
  label = "Label",
  type = "input" as "input" | "textarea",
  isRequired = false,
  error = undefined as string | undefined,
  inputPattern = undefined as RegExp | undefined,
  title = undefined as string | undefined,
}) => {
  // Create a simple form using react-hook-form
  const {
    register,
    formState: { errors },
  } = useForm();

  return (
    <div className="p-6 bg-gray-900 min-w-[350px]">
      <InputField
        name={name}
        label={label}
        htmlFor={`field-${name}`}
        type={type}
        isRequired={isRequired}
        register={register}
        error={error}
        inputPattern={inputPattern}
      />
    </div>
  );
};

// Default text input
export const DefaultInput = () => (
  <InputFieldStory label="Your Name" name="name" />
);

// With error message
export const WithError = () => (
  <InputFieldStory
    label="Username"
    name="username"
    error="Username is already taken"
  />
);

// Textarea input
export const TextareaInput = () => (
  <InputFieldStory label="Your Message" name="message" type="textarea" />
);
