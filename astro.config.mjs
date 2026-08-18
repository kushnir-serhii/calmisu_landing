import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import svgr from "vite-plugin-svgr";

// https://astro.build/config
export default defineConfig({
  site: "https://calmisu.com",
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
