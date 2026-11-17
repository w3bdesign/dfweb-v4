/** Public portfolio identity, shared by the Person and WebSite graph nodes. */
export function getStructuredData() {
  const url = "https://www.dfweb.no";
  const personId = `${url}/#person`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: "Daniel Fjeldstad",
        url: `${url}/`,
        jobTitle: "Frontendutvikler",
        sameAs: ["https://github.com/w3bdesign"],
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        name: "Dfweb",
        url: `${url}/`,
        inLanguage: "nb-NO",
        author: { "@id": personId },
      },
    ],
  };
}

/** Escape less-than signs so JSON cannot terminate its containing script. */
export function serializeStructuredData(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
