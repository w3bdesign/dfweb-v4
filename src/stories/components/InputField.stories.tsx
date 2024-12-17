import React from "react";
import { Meta, Story } from "@ladle/react";
import InputField, {
  InputProps,
} from "../../components/UI/InputField.component";
import { useForm, FieldValues } from "react-hook-form";

export default {
  title: "InputField",
  component: InputField,
} as Meta;

// Define a type for the form values
interface StoryFormValues extends FieldValues {
  defaultInput?: string;
  requiredInput?: string;
  emailInput?: string;
  textArea?: string;
  errorInput?: string;
}

// Wrapper component to provide form context
const InputFieldWrapper = <T extends FieldValues>(
  props: Omit<InputProps<T>, "register">,
) => {
  const { register } = useForm<T>();
  return <InputField {...props} register={register} />;
};

const Template: Story<Omit<InputProps<StoryFormValues>, "register">> = (
  args,
) => <InputFieldWrapper {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: "defaultInput",
  label: "Default Input",
  htmlFor: "defaultInput",
};

export const Required = Template.bind({});
Required.args = {
  name: "requiredInput",
  label: "Required Input",
  htmlFor: "requiredInput",
  isRequired: true,
};

export const WithPattern = Template.bind({});
WithPattern.args = {
  name: "emailInput",
  label: "Email Input",
  htmlFor: "emailInput",
  inputPattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  title: "Please enter a valid email address",
};

export const TextArea = Template.bind({});
TextArea.args = {
  name: "textArea",
  label: "Text Area",
  htmlFor: "textArea",
  type: "textarea",
};

export const WithError = Template.bind({});
WithError.args = {
  name: "errorInput",
  label: "Input with Error",
  htmlFor: "errorInput",
  error: "This field has an error",
};
