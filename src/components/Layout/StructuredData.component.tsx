import {
  getStructuredData,
  serializeStructuredData,
} from "@/lib/structuredData";

export default function StructuredData() {
  return (
    <script id="portfolio-structured-data" type="application/ld+json">
      {serializeStructuredData(getStructuredData())}
    </script>
  );
}
