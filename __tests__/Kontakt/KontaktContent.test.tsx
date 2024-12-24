/**
 * @jest-environment jsdom
 */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import KontaktContent from "@/components/Kontakt/KontaktContent.component";
import { handleContactForm } from "@/app/actions/contact";

jest.mock("@/app/actions/contact", () => ({
  handleContactForm: jest.fn().mockResolvedValue({ success: true, message: "Takk for din beskjed" })
}));

describe("KontaktContent", () => {
  const fulltNavn = "Fullt navn";
  const telefonNummer = "Telefonnummer";
  const hvaOnskerDu = "Hva ønsker du å si?";
  const sendSkjemaText = "Send skjema";

  beforeEach(() => {
    (handleContactForm as jest.MockedFunction<typeof handleContactForm>).mockClear();
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

    expect(handleContactForm).toHaveBeenCalledTimes(1);
  });

  test("displays error message on form submission failure", async () => {
    (handleContactForm as jest.MockedFunction<typeof handleContactForm>).mockResolvedValueOnce({ 
      success: false, 
      message: "Feil under sending av skjema" 
    });

    render(<KontaktContent />);

    fillFormWithValidData();
    fireEvent.click(screen.getByText(sendSkjemaText));

    await waitFor(() => {
      expect(
        screen.getByText("Feil under sending av skjema"),
      ).toBeInTheDocument();
    });

    expect(handleContactForm).toHaveBeenCalledTimes(1);
  });

  test("displays validation errors for empty fields", async () => {
    render(<KontaktContent />);

    fireEvent.click(screen.getByText(sendSkjemaText));

    await waitFor(() => {
      expect(screen.getByText("Fullt navn er påkrevd")).toBeInTheDocument();
      expect(screen.getByText("Telefonnummer er påkrevd")).toBeInTheDocument();
      expect(screen.getByText("Beskjed er påkrevd")).toBeInTheDocument();
    });

    expect(handleContactForm).not.toHaveBeenCalled();
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

    expect(handleContactForm).not.toHaveBeenCalled();
  });
});
