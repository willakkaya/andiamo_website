import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import App from "./App";

/**
 * Build-time renderer. scripts/prerender.mjs calls this once per route and
 * writes the markup into that route's static HTML, so crawlers and assistants
 * that do not run JavaScript still get the full page text. The browser then
 * hydrates the same markup (see main.tsx).
 */
export function render(path: string): string {
  return renderToString(
    <Router ssrPath={path} ssrSearch="">
      <App />
    </Router>,
  );
}
