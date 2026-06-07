import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/tests/setup.ts"],
    include: [
      "src/**/*.test.ts",
      "src/**/*.test.tsx",
    ],
    exclude: ["src/routes/**", "node_modules/**", "dist/**", ".lovable/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/utils/**", "src/services/**", "src/store/**", "src/components/**"],
    },
  },
});