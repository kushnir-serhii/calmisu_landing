import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import svgr from "vite-plugin-svgr";

// https://astro.build/config
export default defineConfig({
  site: "https://calmisu.com",
  integrations: [react(), tailwind(), sitemap()],
  vite: {
    plugins: [svgr()],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
});
