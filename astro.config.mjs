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
      // /delete-account/ ships <meta name="robots" content="noindex">; listing
      // it in the sitemap would contradict that. Keep this in sync with the
      // `noindex` prop in src/pages/delete-account.astro.
      filter: (page) => !page.startsWith("https://calmisu.com/delete-account"),
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
