import React from "react";
import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import InputField, {
  createRegisterOptions,
} from "../../src/components/UI/InputField.component";

interface TestFormData {
  testField: string;
}

const TestComponent = ({
  type = "input",
  isRequired = false,
  inputPattern,
}: {
  type?: "input" | "textarea";
  isRequired?: boolean;
  inputPattern?: RegExp;
}) => {
  const { register } = useForm<TestFormData>();

  return (
    <InputField<TestFormData>
      name="testField"
      label="Test Field"
      htmlFor="testField"
      type={type}
      isRequired={isRequired}
      inputPattern={inputPattern}
      register={register}
    />
  );
};

describe("InputField", () => {
  it("renders an input field correctly", () => {
    render(<TestComponent />);
    expect(screen.getByLabelText("Test Field")).toBeInTheDocument();
  });

  it("renders a textarea correctly", () => {
    render(<TestComponent type="textarea" />);
    expect(screen.getByLabelText("Test Field")).toBeInTheDocument();
    expect(screen.getByLabelText("Test Field").tagName).toBe("TEXTAREA");
  });

  it("creates correct register options when isRequired is true", () => {
    const options = createRegisterOptions(true);
    expect(options.required).toBe("Dette feltet er påkrevd");
  });

  it("creates correct register options when inputPattern is provided", () => {
    const pattern = /[A-Za-z]+/;
    const options = createRegisterOptions(false, pattern);
    expect(options.pattern).toBeDefined();
    expect((options.pattern as { value: RegExp }).value).toEqual(pattern);
  });

  it("displays an error message when provided", () => {
    render(
      <InputField<TestFormData>
        name="testField"
        label="Test Field"
        htmlFor="testField"
        register={jest.fn()}
        error="This is an error message"
      />,
    );
    expect(screen.getByText("This is an error message")).toBeInTheDocument();
  });
});
