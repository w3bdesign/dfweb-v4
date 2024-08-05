/**
 * @jest-environment jsdom
 */

import React from "react";
import {
  fireEvent,
  render,
  screen,
  act,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the component", () => {
    render(<KontaktContent />);
    expect(screen.getByTestId("kontaktcontent")).toBeInTheDocument();
  });

  test("displays error messages for invalid input", async () => {
    render(<KontaktContent />);

    const submitButton = screen.getByText("Send skjema");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Navn er påkrevd")).toBeInTheDocument();
      expect(
        screen.getByText("Telefonnummer må være minst 8 siffer")
      ).toBeInTheDocument();
      expect(screen.getByText("Melding er påkrevd")).toBeInTheDocument();
    });
  });

  test("submits the form successfully", async () => {
    render(<KontaktContent />);

    await act(async () => {
      await userEvent.type(screen.getByLabelText(fulltNavn), "Bruker Test");
      await userEvent.type(screen.getByLabelText(telefonNummer), "12345678");
      await userEvent.type(screen.getByLabelText(hvaOnskerDu), "Test melding");
    });

    const submitButton = screen.getByText("Send skjema");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(emailjs.send).toHaveBeenCalledTimes(1);
      expect(screen.getByText("Takk for din beskjed")).toBeInTheDocument();
    });
  });

  test("displays error message on form submission failure", async () => {
    emailjs.send.mockRejectedValueOnce(new Error("Failed to send"));

    render(<KontaktContent />);

    await act(async () => {
      await userEvent.type(screen.getByLabelText(fulltNavn), "Bruker Test");
      await userEvent.type(screen.getByLabelText(telefonNummer), "12345678");
      await userEvent.type(screen.getByLabelText(hvaOnskerDu), "Test melding");
    });

    const submitButton = screen.getByText("Send skjema");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(emailjs.send).toHaveBeenCalledTimes(1);
      expect(
        screen.getByText("Feil under sending av skjema")
      ).toBeInTheDocument();
    });
  });

  test("validates input patterns", async () => {
    render(<KontaktContent />);

    await act(async () => {
      await userEvent.type(screen.getByLabelText(fulltNavn), "Bruker123");
      await userEvent.type(screen.getByLabelText(telefonNummer), "abcdefgh");
    });

    const submitButton = screen.getByText("Send skjema");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Vennligst bruk norske bokstaver")
      ).toBeInTheDocument();
      expect(screen.getByText("Vennligst bruk bare tall")).toBeInTheDocument();
    });
  });
});
