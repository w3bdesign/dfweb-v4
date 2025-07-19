/**
 * @jest-environment jsdom
 */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ContactForm from "@/components/Kontakt/ContactForm.component";
import emailjs, { EmailJSResponseStatus } from "@emailjs/browser";

type SendType = jest.Mock<Promise<EmailJSResponseStatus>>;

jest.mock("@emailjs/browser", () => ({
  send: jest.fn(() => Promise.resolve({ status: 200, text: "OK" })) as SendType,
  init: jest.fn(),
}));

describe("ContactForm", () => {
  const fulltNavn = "Fullt navn";
  const telefonNummer = "Telefonnummer";
  const hvaOnskerDu = "Hva ønsker du å si?";
  const sendSkjemaText = "Send skjema";

  beforeEach(() => {
    jest.clearAllMocks();
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
    (emailjs.send as SendType).mockRejectedValueOnce(new Error("Test error"));
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
