import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import RouteError from "@/components/ErrorBoundary/RouteError.component";

describe("RouteError", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("renders the description and error message, and logs the error", () => {
    // Arrange
    const error = new Error("Something broke");
    const description = "Det oppsto en feil under lasting av CV-siden.";

    // Act
    render(
      <RouteError error={error} reset={jest.fn()} description={description} />,
    );

    // Assert
    expect(
      screen.getByRole("heading", { name: "Noe gikk galt" }),
    ).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
    expect(screen.getByText("Something broke")).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
  });

  it("does not render the message block when the error has no message", () => {
    // Arrange
    const error = new Error("");

    // Act
    const { container } = render(
      <RouteError error={error} reset={jest.fn()} description="Beskrivelse" />,
    );

    // Assert
    expect(container.querySelector(".font-mono")).not.toBeInTheDocument();
  });

  it("calls reset when the retry button is clicked", async () => {
    // Arrange
    const reset = jest.fn();
    const user = userEvent.setup();
    render(
      <RouteError
        error={new Error("x")}
        reset={reset}
        description="Beskrivelse"
      />,
    );

    // Act
    await user.click(screen.getByRole("button", { name: "Prøv igjen" }));

    // Assert
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
