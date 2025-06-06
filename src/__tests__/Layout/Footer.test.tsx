/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";

import Footer from "@/components/Layout/Footer.component";

describe("Footer", () => {
  it("renders footer with copyright text", () => {
    // Arrange
    const copyrightText = "copyright daniel";
    const expectedText = /copyright daniel/i;

    // Act
    render(<Footer footerCopyrightText={copyrightText} />);
    const footer = screen.getByText(expectedText);

    // Assert
    expect(footer).toBeInTheDocument();
  });
});
