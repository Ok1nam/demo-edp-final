import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react({ jsxRuntime: "automatic" })],
  base: "./", // IMPORTANT : Changez la base en './' pour des chemins relatifs
  root: "client",

  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    publicDir: path.resolve(__dirname, "client/public"),
    rollupOptions: {
      input: path.resolve(__dirname, "client/public/index.html"),
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
});