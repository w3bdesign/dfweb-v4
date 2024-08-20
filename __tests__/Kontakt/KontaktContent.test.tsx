import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import KontaktContent from "../../src/components/Kontakt/KontaktContent.component";
import emailjs from "@emailjs/browser";

jest.mock("@emailjs/browser", () => ({
  sendForm: jest.fn(() => Promise.resolve()),
  init: jest.fn(),
}));

describe("KontaktContent", () => {
  const fulltNavn = "Fullt navn";
  const telefonNummer = "Telefonnummer";
  const hvaOnskerDu = "Hva ønsker du å si?";

  it("renders the component", async () => {
    render(<KontaktContent />);
    expect(await screen.findByTestId("kontaktcontent")).toBeInTheDocument();
  });

}

  );

  /*
  it("submits the form and displays success message", async () => {
    render(<KontaktContent />);

    fireEvent.input(screen.getByLabelText(fulltNavn), {
      target: { value: "Bruker Test" },
    });
    fireEvent.input(screen.getByLabelText(telefonNummer), {
      target: { value: "12345678" },
    });
    fireEvent.input(screen.getByLabelText(hvaOnskerDu), {
      target: { value: "Message" },
    });

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(screen.getByText("Takk for din beskjed")).toBeInTheDocument();
    });
  });

  it("submits the form and displays error message", async () => {
    emailjs.sendForm.mockImplementationOnce(() =>
      Promise.reject(new Error("Error"))
    );

    render(<KontaktContent />);

    fireEvent.input(screen.getByLabelText(fulltNavn), {
      target: { value: "Bruker Test" },
    });
    fireEvent.input(screen.getByLabelText(telefonNummer), {
      target: { value: "12345678" },
    });
    fireEvent.input(screen.getByLabelText(hvaOnskerDu), {
      target: { value: "Message" },
    });

    //fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(
        screen.getByText("Feil under sending av skjema")
      ).toBeInTheDocument();
    });
  });
});
*/
