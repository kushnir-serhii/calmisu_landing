import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import svgr from "vite-plugin-svgr";

// https://astro.build/config
export default defineConfig({
  site: "https://calmisu.com",
  // GitHub Pages 301s /foo -> /foo/ for directory index files. Emitting the
  // canonical slashed form everywhere keeps those redirects out of Search
  // Console's "Page with redirect" bucket.
  trailingSlash: "always",
  redirects: {
    "/articles": "/blog/",
    "/articles/": "/blog/",
    "/articles/[...slug]": "/blog/[...slug]",
    // The two /articles/ URLs Google actually indexed had slugs that no
    // longer exist under /blog/, so the wildcard above can't catch them.
    // Point each at its closest replacement instead of letting them 404.
    "/articles/box-breathing-for-anxiety/":
      "/blog/extended-exhale-breathing-science/",
    "/articles/grounding-techniques-for-panic-attacks/":
      "/blog/adrenaline-clock-stopping-panic-attacks/",
  },
  integrations: [
    react(),
    tailwind(),
    sitemap({
      // Pages that ship <meta name="robots" content="noindex..."> must not be
      // listed here — a sitemap entry contradicts the tag. Keep in sync with:
      //   - the `noindex` prop in src/pages/delete-account.astro
      //   - the `noindexFollow` prop on the /alma/* pages
      //   - the `noindexFollow` prop in src/pages/quiz/result.astro
      // Note /quiz/ itself IS indexable — only the result page is excluded.
      filter: (page) =>
        !page.startsWith("https://calmisu.com/delete-account") &&
        !page.includes("/alma/") &&
        !page.startsWith("https://calmisu.com/quiz/result"),
    }),
  ],
  vite: {
    plugins: [svgr()],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
});
