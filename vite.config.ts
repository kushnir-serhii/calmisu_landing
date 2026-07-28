import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";
import svgr from "vite-plugin-svgr";

/**
 * Dev-only: serve static HTML pages from public/ before the SPA fallback.
 *
 * Vite's dev server sends extensionless paths straight to index.html, so pages
 * that exist as real files in public/ (the legal pages under /alma and /en, /pl,
 * /uk) render as the React app instead — complete with the SPA's own language
 * switcher, which builds locale-first URLs like /pl/alma/privacy-policy.
 *
 * Production does not have this problem: GitHub Pages serves a real file whenever
 * one exists and only falls back to 404.html otherwise. This makes dev match.
 */
function servePublicHtmlPages(publicDir: string): Plugin {
  return {
    name: "serve-public-html-pages",
    apply: "serve",
    configureServer(server) {
      // Registered directly (not as a post hook) so it runs *before* Vite's
      // internal SPA-fallback middleware.
      server.middlewares.use((req, res, next) => {
        if (req.method !== "GET" && req.method !== "HEAD") return next();

        const urlPath = decodeURIComponent((req.url ?? "/").split("?")[0]);

        // Only ever resolve inside publicDir — guards against ../ traversal.
        const resolved = path.resolve(publicDir, "." + urlPath);
        if (!resolved.startsWith(path.resolve(publicDir))) return next();

        const candidates = [
          path.join(resolved, "index.html"),
          resolved.endsWith(".html") ? resolved : `${resolved}.html`,
        ];

        const file = candidates.find(
          (f) => fs.existsSync(f) && fs.statSync(f).isFile(),
        );
        if (!file) return next();

        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(fs.readFileSync(file));
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  base: "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    servePublicHtmlPages(path.resolve(__dirname, "public")),
    react(),
    svgr(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
