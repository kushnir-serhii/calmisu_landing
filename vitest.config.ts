import { defineConfig } from "vitest/config";
import path from "path";

// No React plugin: it existed only for Fast Refresh, which tests never use.
// Vite's built-in esbuild transform already handles .tsx (tsconfig sets
// jsx: "react-jsx"), so JSX tests remain possible without the extra dep.
export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
