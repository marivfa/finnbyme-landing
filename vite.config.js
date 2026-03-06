import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "src",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        en: resolve(__dirname, "src/en/index.html"),
        es: resolve(__dirname, "src/es/index.html")
      }
    }
  }
});
