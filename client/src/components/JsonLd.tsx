/**
 * Structured data rendered as part of the page markup, so it is present in the
 * prerendered HTML (crawlers that skip JavaScript read it) and stays in sync
 * with the visible content it is built from.
 */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // "<" is escaped so no value can close the script element early
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
