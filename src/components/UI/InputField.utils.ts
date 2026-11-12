import type { FieldValues, Path, RegisterOptions } from "react-hook-form";

/**
 * Creates register options for react-hook-form
 * @template T - Type extending FieldValues
 * @param {boolean} [isRequired] - Whether the field is required
 * @param {RegExp} [inputPattern] - Regular expression pattern for input validation
 * @param {string} [title] - Title for the input field
 * @returns {RegisterOptions<T, Path<T>>} Register options object
 */
export function createRegisterOptions<T extends FieldValues>(
  isRequired?: boolean,
  inputPattern?: RegExp,
  title?: string,
): RegisterOptions<T, Path<T>> {
  return {
    required: isRequired ? "Dette feltet er påkrevd" : false,
    ...(inputPattern
      ? { pattern: { value: inputPattern, message: title ?? "Ugyldig format" } }
      : {}),
  };
}
