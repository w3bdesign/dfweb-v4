/**
 * @jest-environment jsdom
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import { useContactForm } from "@/hooks/useContactForm";
import emailjs, { EmailJSResponseStatus } from "@emailjs/browser";
import type { FormData } from "@/components/Kontakt/config/formConfig";

type SendType = jest.Mock<Promise<EmailJSResponseStatus>>;

jest.mock("@emailjs/browser", () => ({
  send: jest.fn(() => Promise.resolve({ status: 200, text: "OK" })) as SendType,
  init: jest.fn(),
}));

const validData: FormData = {
  navn: "Bruker Test",
  telefon: "12345678",
  tekst: "Test melding",
};

describe("useContactForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("exposes the form API and initial state", () => {
    // Arrange
    const { result } = renderHook(() => useContactForm());

    // Act
    const api = result.current;

    // Assert
    expect(typeof api.register).toBe("function");
    expect(typeof api.handleSubmit).toBe("function");
    expect(typeof api.handleFormSubmit).toBe("function");
    expect(api.errors).toBeDefined();
    expect(api.isSubmitting).toBe(false);
    expect(api.serverResponse).toBe("");
  });

  it("uses the provided initialResponse as the server response", () => {
    // Arrange
    const initialResponse = "Allerede sendt";

    // Act
    const { result } = renderHook(() =>
      useContactForm({ initialResponse }),
    );

    // Assert
    expect(result.current.serverResponse).toBe(initialResponse);
  });

  it("sends via EmailJS and sets the success message on submit", async () => {
    // Arrange
    const { result } = renderHook(() => useContactForm());

    // Act
    await act(async () => {
      await result.current.handleFormSubmit(validData);
    });

    // Assert
    expect(emailjs.send).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(result.current.serverResponse).toBe("Takk for din beskjed");
    });
  });

  it("sets the error message when EmailJS submission fails", async () => {
    // Arrange
    (emailjs.send as SendType).mockRejectedValueOnce(new Error("boom"));
    const { result } = renderHook(() => useContactForm());

    // Act
    await act(async () => {
      await result.current.handleFormSubmit(validData);
    });

    // Assert
    await waitFor(() => {
      expect(result.current.serverResponse).toBe("Feil under sending av skjema");
    });
  });

  it("uses an injected onSubmit handler instead of EmailJS when provided", async () => {
    // Arrange
    const onSubmit = jest.fn(() => Promise.resolve("Custom svar"));
    const { result } = renderHook(() => useContactForm({ onSubmit }));

    // Act
    await act(async () => {
      await result.current.handleFormSubmit(validData);
    });

    // Assert
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(validData);
    expect(emailjs.send).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(result.current.serverResponse).toBe("Custom svar");
    });
  });
});
