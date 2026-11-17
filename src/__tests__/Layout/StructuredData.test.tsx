import { renderToStaticMarkup } from "react-dom/server";
import StructuredData from "@/components/Layout/StructuredData.component";
import { getStructuredData } from "@/lib/structuredData";

describe("StructuredData", () => {
  it("server-renders a script containing valid JSON rather than HTML entities", () => {
    // Arrange
    const parser = new DOMParser();

    // Act
    const html = renderToStaticMarkup(<StructuredData />);
    const parsed = parser.parseFromString(html, "text/html");
    const script = parsed.querySelector("script#portfolio-structured-data");

    // Assert
    expect(script?.getAttribute("type")).toBe("application/ld+json");
    expect(JSON.parse(script?.textContent ?? "")).toStrictEqual(
      getStructuredData(),
    );
    expect(parsed.querySelectorAll("script")).toHaveLength(1);
  });
});
