import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { UseFormRegister } from "react-hook-form";
import InputField, {
  createRegisterOptions,
} from "@/components/UI/InputField.component";

interface TestFormData {
  testField: string;
}

const mockRegister: UseFormRegister<TestFormData> = jest.fn((name) => ({
  onChange: jest.fn(),
  onBlur: jest.fn(),
  ref: jest.fn(),
  name,
}));

const TestComponent = ({
  type = "input",
  isRequired = false,
  inputPattern,
}: {
  type?: "input" | "textarea";
  isRequired?: boolean;
  inputPattern?: RegExp;
}) => {
  return (
    <InputField<TestFormData>
      name="testField"
      label="Test Field"
      htmlFor="testField"
      type={type}
      isRequired={isRequired}
      inputPattern={inputPattern}
      register={mockRegister}
    />
  );
};

describe("InputField", () => {
  describe("rendering", () => {
    it("renders input field with label", () => {
      // Arrange
      const expectedLabel = "Test Field";

      // Act
      render(<TestComponent />);
      const input = screen.getByLabelText(expectedLabel);

      // Assert
      expect(input).toBeInTheDocument();
    });

    it("renders textarea when specified", () => {
      // Arrange
      const expectedLabel = "Test Field";
      const expectedTag = "TEXTAREA";

      // Act
      render(<TestComponent type="textarea" />);
      const textarea = screen.getByLabelText(expectedLabel);

      // Assert
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe(expectedTag);
    });

    it("displays provided error message", () => {
      // Arrange
      const errorMessage = "This is an error message";
      const props = {
        name: "testField" as const,
        label: "Test Field",
        htmlFor: "testField",
        register: mockRegister,
        error: errorMessage,
      };

      // Act
      render(<InputField<TestFormData> {...props} />);

      // Assert
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe("form registration", () => {
    it("creates required validation option when isRequired is true", () => {
      // Arrange
      const isRequired = true;
      const expectedMessage = "Dette feltet er påkrevd";

      // Act
      const options = createRegisterOptions(isRequired);

      // Assert
      expect(options.required).toBe(expectedMessage);
    });

    it("creates pattern validation option when pattern is provided", () => {
      // Arrange
      const pattern = /[A-Za-z]+/;
      const isRequired = false;

      // Act
      const options = createRegisterOptions(isRequired, pattern);

      // Assert
      expect(options.pattern).toBeDefined();
      expect((options.pattern as { value: RegExp }).value).toEqual(pattern);
    });
  });
});
