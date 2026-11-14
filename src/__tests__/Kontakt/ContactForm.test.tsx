/**
 * @vitest-environment jsdom
 */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ContactForm from "@/components/Kontakt/ContactForm.component";
import emailjs from "@emailjs/browser";

// The component loads the SDK with a dynamic import and calls its default export
const emailjsMock = vi.hoisted(() => ({
  send: vi.fn(() => Promise.resolve({ status: 200, text: "OK" })),
  init: vi.fn(),
}));

vi.mock("@emailjs/browser", () => ({
  default: emailjsMock,
  ...emailjsMock,
}));

describe("ContactForm", () => {
  const fulltNavn = "Fullt navn";
  const telefonNummer = "Telefonnummer";
  const hvaOnskerDu = "Hva ønsker du å si?";
  const sendSkjemaText = "Send skjema";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const fillFormWithValidData = () => {
    fireEvent.change(screen.getByLabelText(fulltNavn), {
      target: { value: "Bruker Test" },
    });
    fireEvent.change(screen.getByLabelText(telefonNummer), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByLabelText(hvaOnskerDu), {
      target: { value: "Test melding" },
    });
  };

  it("renders the component", () => {
    // Arrange
    const expectedTestId = "kontaktcontent";

    // Act
    render(<ContactForm />);

    // Assert
    expect(screen.getByTestId(expectedTestId)).toBeInTheDocument();
  });

  it("posts the CSRF token as a hidden field when one is provided", () => {
    // Arrange
    const csrfToken = "test-csrf-token";

    // Act
    render(<ContactForm csrfToken={csrfToken} />);

    // Assert
    const form = screen.getByRole<HTMLFormElement>("form", {
      name: "Contact Form",
    });
    const field = form.elements.namedItem("_csrf") as HTMLInputElement | null;
    expect(field?.type).toBe("hidden");
    expect(field?.value).toBe(csrfToken);
  });

  it("omits the CSRF field when no token is provided", () => {
    // Arrange
    const formName = "Contact Form";

    // Act
    render(<ContactForm />);

    // Assert
    const form = screen.getByRole<HTMLFormElement>("form", { name: formName });
    expect(form.elements.namedItem("_csrf")).toBeNull();
  });

  it("submits the form successfully and disables submit button while submitting", async () => {
    // Arrange
    render(<ContactForm />);
    const submitButton = screen.getByText(sendSkjemaText);

    // Act
    fillFormWithValidData();
    fireEvent.click(submitButton);

    // Assert - Initial state
    expect(submitButton).toBeDisabled();

    // Assert - Final state
    await waitFor(() => {
      expect(screen.getByText("Takk for din beskjed")).toBeInTheDocument();
    });
    expect(emailjs.send).toHaveBeenCalledTimes(1);
  });

  it("displays error message on form submission failure", async () => {
    // Arrange
    vi.mocked(emailjs.send).mockRejectedValueOnce(new Error("Test error"));
    render(<ContactForm />);

    // Act
    fillFormWithValidData();
    fireEvent.click(screen.getByText(sendSkjemaText));

    // Assert
    await waitFor(() => {
      expect(
        screen.getByText("Feil under sending av skjema"),
      ).toBeInTheDocument();
    });
    expect(emailjs.send).toHaveBeenCalledTimes(1);
  });

  it("displays validation errors for empty fields", async () => {
    // Arrange
    render(<ContactForm />);
    const expectedErrors = {
      name: "Fullt navn er påkrevd",
      phone: "Telefonnummer er påkrevd",
      message: "Beskjed er påkrevd",
    };

    // Act
    fireEvent.click(screen.getByText(sendSkjemaText));

    // Assert
    await waitFor(() => {
      expect(screen.getByText(expectedErrors.name)).toBeInTheDocument();
    });
    expect(screen.getByText(expectedErrors.phone)).toBeInTheDocument();
    expect(screen.getByText(expectedErrors.message)).toBeInTheDocument();
    expect(emailjs.send).not.toHaveBeenCalled();
  });

  it("displays validation errors for invalid inputs", async () => {
    // Arrange
    render(<ContactForm />);
    const invalidInputs = {
      name: "User123", // Invalid name format
      phone: "123", // Invalid phone number
      message: "Test melding",
    };
    const expectedErrors = {
      name: "Vennligst bruk norske bokstaver",
      phone: "Vennligst oppgi et gyldig telefonnummer",
    };

    // Act
    fireEvent.change(screen.getByLabelText(fulltNavn), {
      target: { value: invalidInputs.name },
    });
    fireEvent.change(screen.getByLabelText(telefonNummer), {
      target: { value: invalidInputs.phone },
    });
    fireEvent.change(screen.getByLabelText(hvaOnskerDu), {
      target: { value: invalidInputs.message },
    });
    fireEvent.click(screen.getByText(sendSkjemaText));

    // Assert
    await waitFor(() => {
      expect(screen.getByText(expectedErrors.name)).toBeInTheDocument();
    });
    expect(screen.getByText(expectedErrors.phone)).toBeInTheDocument();
    expect(emailjs.send).not.toHaveBeenCalled();
  });
});
