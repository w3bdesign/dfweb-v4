/**
 * @jest-environment jsdom
 */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import KontaktContent from "../../src/components/Kontakt/KontaktContent.component";
import emailjs from "@emailjs/browser";

jest.mock("@emailjs/browser", () => ({
  send: jest.fn(() => Promise.resolve()),
  init: jest.fn(),
}));

describe("KontaktContent", () => {
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

  test("renders the component", () => {
    render(<KontaktContent />);
    expect(screen.getByTestId("kontaktcontent")).toBeInTheDocument();
  });

  test("submits the form successfully and disables submit button while submitting", async () => {
    render(<KontaktContent />);

    fillFormWithValidData();

    const submitButton = screen.getByText(sendSkjemaText);
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByText("Takk for din beskjed")).toBeInTheDocument();
    });

    expect(emailjs.send).toHaveBeenCalledTimes(1);
  });

  test("displays error message on form submission failure", async () => {
    emailjs.send.mockRejectedValueOnce(new Error("Test error"));

    render(<KontaktContent />);

    fillFormWithValidData();
    fireEvent.click(screen.getByText(sendSkjemaText));

    await waitFor(() => {
      expect(
        screen.getByText("Feil under sending av skjema"),
      ).toBeInTheDocument();
    });

    expect(emailjs.send).toHaveBeenCalledTimes(1);
  });

  test("displays validation errors for empty fields", async () => {
    render(<KontaktContent />);

    fireEvent.click(screen.getByText(sendSkjemaText));

    await waitFor(() => {
      expect(screen.getByText("Fullt navn er påkrevd")).toBeInTheDocument();
      expect(screen.getByText("Telefonnummer er påkrevd")).toBeInTheDocument();
      expect(screen.getByText("Beskjed er påkrevd")).toBeInTheDocument();
    });

    expect(emailjs.send).not.toHaveBeenCalled();
  });

  test("displays validation errors for invalid inputs", async () => {
    render(<KontaktContent />);

    fireEvent.change(screen.getByLabelText(fulltNavn), {
      target: { value: "User123" }, // Invalid name format
    });
    fireEvent.change(screen.getByLabelText(telefonNummer), {
      target: { value: "123" }, // Invalid phone number
    });
    fireEvent.change(screen.getByLabelText(hvaOnskerDu), {
      target: { value: "Test melding" },
    });

    fireEvent.click(screen.getByText(sendSkjemaText));

    await waitFor(() => {
      expect(
        screen.getByText("Vennligst bruk norske bokstaver"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Vennligst oppgi et gyldig telefonnummer"),
      ).toBeInTheDocument();
    });

    expect(emailjs.send).not.toHaveBeenCalled();
  });
});
