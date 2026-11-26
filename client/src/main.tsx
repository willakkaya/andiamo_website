import { createRoot, hydrateRoot } from "react-dom/client";
import { Router } from "wouter";
import App from "./App";
import "./index.css";

const container = document.getElementById("root")!;
// Same wrapper as entry-server.tsx so both renders have the same tree shape.
const app = (
  <Router>
    <App />
  </Router>
);

// Every route is prerendered at build time (scripts/prerender.mjs). Hydrate
// when #root already holds this URL's markup. Render from scratch when it is
// the empty fallback shell (unknown URL), or when the inline script in
// index.html flagged the URL with data-csr because its query string changes
// what the page shows (the prerender is always the no-query version).
const root = document.documentElement;
if (container.hasChildNodes() && !root.hasAttribute("data-csr")) {
  hydrateRoot(container, app);
} else {
  container.textContent = "";
  root.removeAttribute("data-csr");
  createRoot(container).render(app);
}
