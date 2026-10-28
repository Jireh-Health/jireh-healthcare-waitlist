import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    moduleNameMapper: {
      "^next/navigation$": path.resolve(__dirname, "__mocks__/next-navigation.ts"),
      "^next/image$": path.resolve(__dirname, "__mocks__/next-image.tsx"),
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
