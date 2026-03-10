import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const base = "/calmisu-landing/";

const rewritePublicPaths = (): Plugin => ({
  name: "rewrite-public-paths",
  transform(code, id) {
    if (id.includes("node_modules") || !/\.[jt]sx?$/.test(id)) return;
    if (!code.includes('"/images/')) return;
    return { code: code.replaceAll('"/images/', `"${base}images/`) };
  },
});

export default defineConfig(({ mode }) => ({
  base,
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    rewritePublicPaths(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
