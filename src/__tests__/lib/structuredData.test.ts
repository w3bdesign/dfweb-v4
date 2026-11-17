import {
  getStructuredData,
  serializeStructuredData,
} from "@/lib/structuredData";

describe("portfolio structured data", () => {
  it("links the Norwegian website to its public author profile", () => {
    // Arrange
    const personId = "https://www.dfweb.no/#person";

    // Act
    const data = getStructuredData();

    // Assert
    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@graph"]).toStrictEqual([
      {
        "@type": "Person",
        "@id": personId,
        name: "Daniel Fjeldstad",
        url: "https://www.dfweb.no/",
        jobTitle: "Frontendutvikler",
        sameAs: ["https://github.com/w3bdesign"],
      },
      {
        "@type": "WebSite",
        "@id": "https://www.dfweb.no/#website",
        name: "Dfweb",
        url: "https://www.dfweb.no/",
        inLanguage: "nb-NO",
        author: { "@id": personId },
      },
    ]);
  });

  it("serializes the graph without altering its values", () => {
    // Arrange
    const data = getStructuredData();

    // Act
    const serialized = serializeStructuredData(data);

    // Assert
    expect(JSON.parse(serialized)).toStrictEqual(data);
  });

  it("escapes every less-than sign to prevent script termination", () => {
    // Arrange
    const data = {
      name: '</script><script>alert("test")</script>',
      text: "æøå & <>",
    };

    // Act
    const serialized = serializeStructuredData(data);

    // Assert
    expect(serialized).not.toContain("<");
    expect(serialized).toContain("\\u003c/script>");
    expect(JSON.parse(serialized)).toStrictEqual(data);
  });
});
