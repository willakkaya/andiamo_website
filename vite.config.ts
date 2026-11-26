import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  // Read by the footer for the prerendered copyright year (same value in the
  // browser and server bundles, since one `pnpm build` produces both).
  define: {
    __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    // The server build (.ssr/, used only by scripts/prerender.mjs) needs no
    // copy of the images and video in client/public.
    copyPublicDir: !isSsrBuild,
  },
  server: {
    host: true,
  },
}));
