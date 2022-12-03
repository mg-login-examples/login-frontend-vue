/// <reference types="vitest" />
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { AllureReporter } from "./src/utils/vitest-custom-test-reporters/allure-reporter";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    reporters: [
      "default",
      // "verbose",
      new AllureReporter({}),
    ],
  },
});
